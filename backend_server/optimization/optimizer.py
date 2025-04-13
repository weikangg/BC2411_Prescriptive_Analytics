from datetime import datetime, timedelta, timezone
from typing import List, Dict
import logging
from gurobipy import Model, GRB, quicksum

from backend_server.data.preprocessing import filter_diets, filter_exercises
from backend_server.utils.calculations import compute_user_metrics
from backend_server.models.output_schema import Meal, Exercise, DailyPlan, WeeklyInfo, OptimizationResult

logging.basicConfig(level=logging.INFO)

##############################
# Gurobi Status Codes Mapping
##############################
GUROBI_STATUS_CODES = {
    1: "LOADED",
    2: "OPTIMAL",
    3: "INFEASIBLE",
    4: "INF_OR_UNBD",
    5: "UNBOUNDED",
    6: "CUTOFF",
    7: "ITERATION_LIMIT",
    8: "NODE_LIMIT",
    9: "TIME_LIMIT",
    10: "SOLUTION_LIMIT",
    11: "INTERRUPTED",
    12: "NUMERIC",
    13: "SUBOPTIMAL",
    14: "INPROGRESS",
    15: "USER_OBJ_LIMIT",
    16: "WORK_LIMIT",
    17: "MEM_LIMIT"
}


##############################################
# Helper function: Diagnose Infeasible Model
##############################################
def diagnose_model(diets_df, ex_df, user_params, metrics) -> List[str]:
    """
    Aggregates diagnostic recommendations for an infeasible model.
    Returns a list of recommendation strings.
    """
    recommendations = []

    T = metrics["days_to_target"]
    target_calorie_pd = metrics["target_calorie_per_day"]
    MPT_day = user_params.get("mealPrepTime") * user_params.get("mealsPerDay")
    FT_day = user_params["freeTime"] * 60
    M = user_params["mealsPerDay"]

    summary = (f"Planning horizon: {T} days; Target calories/day: {target_calorie_pd:.2f}; "
               f"Meal prep time: {MPT_day} min/day; Free time: {FT_day} min/day; Meals per day: {M}")

    # 1. Weight Change Feasibility:
    weight_change = user_params["goalWeight"] - user_params["weight"]
    if abs(weight_change) > 10 and T < 14:
        recommendations.append(
            f"Your target weight change ({weight_change} kg) is very aggressive for a short horizon ({T} days). "
            f"Consider reducing your target weight change or extending your planning horizon."
        )

    # 2. Meal Calorie Feasibility:
    min_calories = diets_df['calories'].min()
    max_calories = diets_df['calories'].max()
    min_daily_calories = min_calories * M
    max_daily_calories = max_calories * M
    if target_calorie_pd < min_daily_calories:
        recommendations.append(
            f"Your planned calorie intake is too low for {M} meals per day. Consider reducing meals per day or extending your horizon."
        )
    elif target_calorie_pd > max_daily_calories:
        recommendations.append(
            f"Your planned calorie intake is too high for {M} meals per day. Consider increasing the number of meals per day or extending your horizon."
        )

    # 3. Meal Prep Time Feasibility:
    min_meal_time = diets_df['total_time_in_minutes'].min()
    total_min_prep_time = min_meal_time * M
    if total_min_prep_time > MPT_day:
        recommendations.append(
            "The fastest possible meal prep time exceeds your available time. Consider reducing meals per day or increasing available meal prep time."
        )

    # 4. Macronutrient Feasibility:
    goal = user_params["goalType"]
    if goal in {"weight_loss", "endurance"}:
        fat_min, fat_max = 0.2, 0.35
        carb_min, carb_max = 0.45, 0.65
        protein_min, protein_max = 0.1, 0.35
    else:
        fat_min, fat_max = 0.15, 0.3
        carb_min, carb_max = 0.45, 0.6
        protein_min, protein_max = 0.3, 0.35

    meals_in_range = 0
    for _, meal in diets_df.iterrows():
        fat_cal = meal['fat'] * 9
        carb_cal = meal['carbs'] * 4
        protein_cal = meal['protein'] * 4
        total_cal = fat_cal + carb_cal + protein_cal
        fat_pct = fat_cal / total_cal
        carb_pct = carb_cal / total_cal
        protein_pct = protein_cal / total_cal
        if (fat_min <= fat_pct <= fat_max and
            carb_min <= carb_pct <= carb_max and
            protein_min <= protein_pct <= protein_max):
            meals_in_range += 1

    if meals_in_range < M:
        recommendations.append(
            "Not enough meals in our dataset meet the desired macronutrient balance. Consider increasing meals per day."
        )

    # 5. Exercise Options Feasibility:
    if len(ex_df) == 0:
        recommendations.append("No exercise options are available. Consider adding more exercise data.")

    if recommendations:
        return [summary] + recommendations
    else:
        return [summary, "All input parameters appear feasible."]


#########################################################
# Helper function: Generate Optimization Output (JSON)
#########################################################
def generate_optimization_output(model: Model,
                                 days: range,
                                 meals: List,
                                 exercises: List,
                                 x, t,
                                 recipe: Dict,
                                 cal: Dict,
                                 fat: Dict,
                                 carb: Dict,
                                 protein: Dict,
                                 prep_time: Dict,
                                 ex_name: Dict,
                                 workout_type: Dict,
                                 location: Dict,
                                 burn_rate: Dict,
                                 user_params: Dict,
                                 metrics: Dict,
                                 diets_df, ex_df) -> str:
    """
    Extracts the solution from the Gurobi model and aggregates the result in a JSON-compatible
    dictionary that conforms to the output schema.
    It includes a 'status' field and 'recommendations' if the model is infeasible.
    """
    start_date = datetime.now().date()
    plan: List[DailyPlan] = []
    recommendations: List[str] = []

    # If model is solved (OPTIMAL or TIME_LIMIT), extract solution.
    if model.status in [GRB.OPTIMAL, GRB.TIME_LIMIT]:
        total_time_week = 0.0
        total_exercise_time_week = 0.0
        total_net_cal_week = 0.0
        days_count_for_week = 0

        for d in days:
            current_date = start_date + timedelta(days=d)
            selected_meal_indices = [i for i in meals if x[i, d].x > 0.5]
            selected_exercise_indices = [(j, t[j, d].x) for j in exercises if t[j, d].x > 0.001]

            intake = sum(cal[i] for i in selected_meal_indices)
            burned = sum(t_val * burn_rate[j] for j, t_val in selected_exercise_indices)
            net = intake - burned
            meal_time_total = sum(prep_time[i] for i in selected_meal_indices)
            exercise_time_total = sum(t_val for _, t_val in selected_exercise_indices)
            total_time_used = meal_time_total + exercise_time_total

            selected_meals = []
            for i in selected_meal_indices:
                macros = {"carbs": float(carb[i]), "protein": float(protein[i]), "fat": float(fat[i])}
                meal_obj = Meal(
                    recipe=recipe[i],
                    calories=float(cal[i]),
                    macros=macros,
                    total_time=float(prep_time[i])
                )
                selected_meals.append(meal_obj)

            selected_exercises = []
            for j, duration in selected_exercise_indices:
                ex_obj = Exercise(
                    name=ex_name[j],
                    type=workout_type[j],
                    location=location[j],
                    duration=duration,
                    estimated_calories_burned=duration * burn_rate[j]
                )
                selected_exercises.append(ex_obj)

            daily_plan = DailyPlan(
                day=current_date,
                selected_meals=selected_meals,
                selected_exercises=selected_exercises,
                total_time_used=total_time_used,
                total_net_calories=net
            )
            plan.append(daily_plan)

            if d < 7:  # For weekly aggregates, use first 7 days.
                total_time_week += total_time_used
                total_exercise_time_week += exercise_time_total
                total_net_cal_week += net
                days_count_for_week += 1

        avg_free_time_used = total_time_week / days_count_for_week if days_count_for_week else 0.0
        avg_workout_duration = total_exercise_time_week / days_count_for_week if days_count_for_week else 0.0
        avg_net_calories = total_net_cal_week / days_count_for_week if days_count_for_week else 0.0

        free_time_week = user_params.get("freeTime", 0) * 60 * user_params.get("daysWeek", 7)

        weekly_info = WeeklyInfo(
            free_time_week=free_time_week,
            avg_free_time_used=avg_free_time_used,
            avg_workout_duration=avg_workout_duration,
            meals_per_day=user_params.get("mealsPerDay", 0),
            avg_net_calories=avg_net_calories
        )
        status_str = GUROBI_STATUS_CODES.get(model.status, "UNKNOWN")
    # If infeasible, diagnose.
    elif model.status == GRB.INFEASIBLE:
        recommendations = diagnose_model(diets_df, ex_df, user_params, metrics)
        status_str = GUROBI_STATUS_CODES.get(model.status, "UNKNOWN")
        weekly_info = WeeklyInfo(
            free_time_week=0,
            avg_free_time_used=0,
            avg_workout_duration=0,
            meals_per_day=user_params.get("mealsPerDay", 0),
            avg_net_calories=0
        )
        plan = []
    else:
        recommendations = [f"Model ended with status {model.status}."]
        status_str = GUROBI_STATUS_CODES.get(model.status, "UNKNOWN")
        weekly_info = WeeklyInfo(
            free_time_week=0,
            avg_free_time_used=0,
            avg_workout_duration=0,
            meals_per_day=user_params.get("mealsPerDay", 0),
            avg_net_calories=0
        )
        plan = []

    output = OptimizationResult(
        plan=plan,
        weekly_info=weekly_info,
        status=status_str,
        recommendations=recommendations
    )
    return output


##########################################
# Full Solver: Build and Solve the Model
##########################################
def solve_optimization(user_params: dict) -> dict:
    """
    Runs the full optimization process given user parameters.
    Filters the data, computes metrics, builds the model, optimizes,
    and returns a dictionary conforming to the output schema, with status and recommendations.
    """
    # --- Preprocessing ---
    filtered_diets = filter_diets(user_params)
    filtered_exercises = filter_exercises(user_params)
    metrics = compute_user_metrics(user_params)

    # Setup parameters.
    T = metrics["days_to_target"]
    target_calorie_pd = metrics["target_calorie_per_day"]
    goal = user_params["goalType"].replace("_", " ")
    FT_day = user_params["freeTime"] * 60
    MPT_day = user_params["mealPrepTime"] * user_params["mealsPerDay"]
    M = user_params["mealsPerDay"]
    W = user_params["daysWeek"]
    num_weeks = T // 7
    has_partial_week = T % 7 > 0

    logging.info(f"num_days: {T}, num_weeks: {num_weeks}, has_partial_week: {has_partial_week}")
    print(f"Goal: {goal}")
    print(f"Free time per day: {FT_day} mins, Total meal prep time per day: {MPT_day} mins")
    print(f"Meals per day: {M}, Workout days per week: {W}")

    # --- Build Optimization Model ---
    model = Model("FitPlanner")
    model.Params.OutputFlag = 0
    model.setParam('TimeLimit', 300)  # 5 minutes

    days = range(T)
    meals_idx = list(filtered_diets.index)
    exercises_idx = list(filtered_exercises.index)

    # Extract parameters from filtered dataframes.
    recipe = {i: filtered_diets.loc[i, 'recipe'] for i in meals_idx}
    cal = {i: filtered_diets.loc[i, 'calories'] for i in meals_idx}
    fat = {i: filtered_diets.loc[i, 'fat'] for i in meals_idx}
    carb = {i: filtered_diets.loc[i, 'carbs'] for i in meals_idx}
    protein = {i: filtered_diets.loc[i, 'protein'] for i in meals_idx}
    prep_time = {i: filtered_diets.loc[i, 'total_time_in_minutes'] for i in meals_idx}
    ex_name = {j: filtered_exercises.loc[j, 'exercise_name'] for j in exercises_idx}
    location = {j: filtered_exercises.loc[j, 'workout_location'] for j in exercises_idx}
    burn_rate = {j: filtered_exercises.loc[j, 'calories_burned_per_min'] for j in exercises_idx}
    workout_type = {j: filtered_exercises.loc[j, 'activity_type'] for j in exercises_idx}

    max_time = {j: 60 if workout_type[j] in {"Sports"} else
                30 if workout_type[j] in {"Outdoor/Water"} else 20 for j in exercises_idx}

    # Decision variables.
    x = model.addVars(meals_idx, days, vtype=GRB.BINARY, name="x")
    y = model.addVars(exercises_idx, days, vtype=GRB.BINARY, name="y")
    t_var = model.addVars(exercises_idx, days, vtype=GRB.CONTINUOUS, name="t")
    s = model.addVars(days, vtype=GRB.BINARY, name="s")
    Z = model.addVar(vtype=GRB.CONTINUOUS, name="Z")

    model.setObjective(Z, GRB.MINIMIZE)
    cal_intake = quicksum(x[i, d] * cal[i] for i in meals_idx for d in days)
    cal_burned = quicksum(t_var[j, d] * burn_rate[j] for j in exercises_idx for d in days)
    model.addConstr(Z >= cal_intake - cal_burned - T * target_calorie_pd)
    model.addConstr(Z >= -(cal_intake - cal_burned - T * target_calorie_pd))

    for d in days:
        intake_d = quicksum(x[i, d] * cal[i] for i in meals_idx)
        burn_d = quicksum(t_var[j, d] * burn_rate[j] for j in exercises_idx)
        prep_d = quicksum(x[i, d] * prep_time[i] for i in meals_idx)
        exercise_d = quicksum(t_var[j, d] for j in exercises_idx)
        if goal == "weight loss":
            model.addConstr(intake_d - burn_d <= target_calorie_pd)
        elif goal == "weight gain":
            model.addConstr(intake_d - burn_d >= target_calorie_pd)
        elif goal == "endurance":
            model.addConstr(intake_d - burn_d <= target_calorie_pd + 50)
            model.addConstr(intake_d - burn_d >= target_calorie_pd - 50)
        model.addConstr(prep_d <= MPT_day)
        model.addConstr(prep_d + exercise_d <= FT_day)
        model.addConstr(quicksum(x[i, d] for i in meals_idx) == M)
        model.addConstr(s[d] <= quicksum(y[j, d] for j in exercises_idx))
        model.addConstr(s[d] * 0.1 <= quicksum(y[j, d] for j in exercises_idx))
        for j in exercises_idx:
            model.addConstr(t_var[j, d] <= y[j, d] * max_time[j])
        for i in meals_idx:
            if d < T - 1:
                model.addConstr(x[i, d] + x[i, d + 1] <= 1)
        for j in exercises_idx:
            if d < T - 1:
                model.addConstr(y[j, d] + y[j, d + 1] <= 1)
        fat_cal = quicksum(x[i, d] * fat[i] * 9 for i in meals_idx)
        carb_cal = quicksum(x[i, d] * carb[i] * 4 for i in meals_idx)
        protein_cal = quicksum(x[i, d] * protein[i] * 4 for i in meals_idx)
        if goal in {"weight loss", "endurance"}:
            model.addConstr(fat_cal >= 0.2 * target_calorie_pd)
            model.addConstr(fat_cal <= 0.35 * target_calorie_pd)
            model.addConstr(carb_cal >= 0.45 * target_calorie_pd)
            model.addConstr(carb_cal <= 0.65 * target_calorie_pd)
            model.addConstr(protein_cal >= 0.1 * target_calorie_pd)
            model.addConstr(protein_cal <= 0.35 * target_calorie_pd)
        elif goal == "weight gain":
            model.addConstr(fat_cal >= 0.15 * target_calorie_pd)
            model.addConstr(fat_cal <= 0.3 * target_calorie_pd)
            model.addConstr(carb_cal >= 0.45 * target_calorie_pd)
            model.addConstr(carb_cal <= 0.6 * target_calorie_pd)
            model.addConstr(protein_cal >= 0.3 * target_calorie_pd)
            model.addConstr(protein_cal <= 0.35 * target_calorie_pd)

    for w in range(num_weeks):
        week_days = range(w * 7, (w + 1) * 7)
        model.addConstr(quicksum(s[d] for d in week_days) == W)
    if has_partial_week:
        last_week_days = range(num_weeks * 7, T)
        model.addConstr(quicksum(s[d] for d in last_week_days) <= W)

    logging.info("=== Running optimization ===")
    model.optimize()

    logging.info("=== Optimization Running Complete ===")
    output = generate_optimization_output(
        model=model,
        days=days,
        meals=meals_idx,
        exercises=exercises_idx,
        x=x,
        t=t_var,
        recipe=recipe,
        cal=cal,
        fat=fat,
        carb=carb,
        protein=protein,
        prep_time=prep_time,
        ex_name=ex_name,
        workout_type=workout_type,
        location=location,
        burn_rate=burn_rate,
        user_params=user_params,
        metrics=metrics,
        diets_df=filtered_diets,
        ex_df=filtered_exercises
    )
    return output

if __name__ == "__main__":
    # For testing purposes only:
    from backend_server.models.input_schema import UserData

    sample_user = {
        "activityLevel": "Moderately Active",
        "age": 35,
        "daysWeek": 3,
        "dietRestrictions": ["none"],
        "fitnessLevel": "intermediate",
        "freeTime": 3,
        "gender": "male",
        "goalTargetDate": "2025-04-15T04:48:00.000Z",
        "goalType": "weight_loss",
        "goalWeight": 65,
        "height": 175,
        "mealPrepTime": 15,
        "mealsPerDay": 3,
        "name": "wei",
        "preferredLocation": "none",
        "preferredWorkoutType": "none",
        "varietyPreferences": ["none"],
        "weight": 70
    }

    # Cast sample_user to UserData to validate if desired.
    user = UserData.model_validate(sample_user)
    output = solve_optimization(user.model_dump())
    print(output)
