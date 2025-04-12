# optimization/optimizer.py

def simulated_optimization_result(user_params: dict) -> dict:
    """
    Returns a simulated optimization result including daily plans and weekly
    aggregated information.

    The simulated daily plans are repeated based on a base template.
    Additionally, weekly info is computed as follows:
      - free_time_week: computed from freeTime and daysWeek in user_params (in minutes)
      - avg_free_time_used: average of total_time_used for the first 7 days (minutes)
      - avg_workout_duration: average total exercise duration per day (minutes)
      - meals_per_day: passed through from mealPrepTime (or as desired)
      - avg_net_calories: average total_net_calories for the first 7 days
    """

    # Base simulated daily plan template:
    base_plan = {
        "selected_meals": [
            {
                "recipe": "Oatmeal with Banana",
                "calories": 350,
                "macros": {"carbs": 55, "protein": 10, "fat": 8},
                "total_time": 10
            },
            {
                "recipe": "Grilled Chicken Salad",
                "calories": 450,
                "macros": {"carbs": 20, "protein": 35, "fat": 15},
                "total_time": 15
            }
        ],
        "selected_exercises": [
            {
                "name": "Running",
                "type": "Cardio",
                "location": "Outdoor",
                "duration": 30,
                "estimated_calories_burned": 300
            },
            {
                "name": "Weight Lifting",
                "type": "Strength",
                "location": "Gym",
                "duration": 45,
                "estimated_calories_burned": 200
            }
        ],

    }

    # Create simulated daily plans for 7 days. (You may have extra days.)
    daily_plans = []
    for i in range(7):
        day_plan = {
            "day": f"2025-04-{12 + i:02d}",
            # Total time used: sum(prep_time for each meal) + cook_time + total exercise duration
            "total_time_used": (
                sum(meal["total_time"] for meal in base_plan["selected_meals"]) +
                sum(ex["duration"] for ex in base_plan["selected_exercises"])
            ),
            "total_net_calories": -100,  # simulated constant value for demo
            "selected_meals": base_plan["selected_meals"],
            "selected_exercises": base_plan["selected_exercises"],
        }
        daily_plans.append(day_plan)

    # Now calculate weekly aggregates from the first 7 daily plans.
    n = len(daily_plans)
    total_time_used_week = sum(plan["total_time_used"] for plan in daily_plans)
    avg_time_used = total_time_used_week / n

    # Average workout duration per day:
    total_workout_minutes = sum(
        sum(ex["duration"] for ex in plan["selected_exercises"])
        for plan in daily_plans
    )
    avg_workout_duration = total_workout_minutes / n

    # Average net calories per day:
    total_net_calories = sum(plan["total_net_calories"] for plan in daily_plans)
    avg_net_calories = total_net_calories / n

    # Free time per week from the request body:
    free_time_daily_hours = user_params.get("freeTime", 0)  # in hours
    days_week = user_params.get("daysWeek", 0)
    free_time_week = free_time_daily_hours * 60 * days_week  # convert hours to minutes

    weekly_info = {
        "free_time_week": free_time_week,         # total free time available per week (minutes)
        "avg_free_time_used": avg_time_used,        # average total time used per day (minutes)
        "avg_workout_duration": avg_workout_duration,  # average exercise duration per day (minutes)
        "meals_per_day": user_params.get("mealsPerDay", 0),  # as provided; could adjust if needed
        "avg_net_calories": avg_net_calories,        # average net calories per day
    }

    # Return in a structure that validates against OptimizationResult, but we add weekly_info
    # outside the "plan" field (for simulation purposes).
    return {"plan": daily_plans, "weekly_info": weekly_info}


if __name__ == "__main__":
    # For testing this module standalone, we simulate a user request body.

    sample_request_body = {
        "activityLevel": "Sedentary",
        "age": 41,
        "allergies": [],
        "daysWeek": 4,
        "dietRestrictions": ["none"],
        "fitnessLevel": "beginner",
        "freeTime": 4,  # free time per day in hours
        "gender": "male",
        "goalTargetDate": "2025-04-22T04:48:00.000Z",
        "goalType": "weight_gain",
        "goalWeight": 75,
        "height": 170,
        "mealPrepTime": 15,
        "mealsPerDay": 5,
        "name": "wei",
        "preferredLocation": "none",
        "preferredWorkoutType": "none",
        "varietyPreferences": ["none"],
        "weight": 70
    }

    result = simulated_optimization_result(sample_request_body)
    from pprint import pprint
    print("=== Simulated Daily Plans ===")
    pprint(result["plan"])
    print("\n=== Weekly Aggregated Info ===")
    pprint(result["weekly_info"])
