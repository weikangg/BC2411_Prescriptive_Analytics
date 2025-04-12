from datetime import datetime, timezone
import logging


def compute_user_metrics(user: dict) -> dict:
    """
    Given user dict with keys:
      weight (kg), height (cm), age (yrs), gender ("male"/"female"),
      activityLevel (string), goalWeight (kg), goalTargetDate (ISO str)
    returns a dict with BMR, TDEE, weight_change, calorie_change, target_cal_pd.
    """
    w = user["weight"]
    h = user["height"]
    a = user["age"]
    s = 5 if user["gender"].lower() == "male" else -161

    # 1. BMR
    bmr = 10 * w + 6.25 * h - 5 * a + s

    # 2. Activity multiplier map (you may refine these)
    activity_map = {
        "Sedentary": 1.2,
        "Lightly Active": 1.375,
        "Moderately Active": 1.55,
        "Very Active": 1.725,
        "Extra Active": 1.9,
    }
    act = user["activityLevel"].lower()
    multiplier = activity_map.get(act, 1.2)
    tdee = bmr * multiplier

    # 3. Weight change & calorie delta
    gw = user["goalWeight"]
    wt_change = gw - w  # positive if gain

    # T = number of days between today and goalTargetDate
    today = datetime.now(timezone.utc)
    tgt = datetime.fromisoformat(user["goalTargetDate"].replace("Z", "+00:00"))
    days = max((tgt - today).days, 1)

    cal_change = 7700 * wt_change / days

    # 4. target calories per day
    target_cal_pd = tdee + cal_change

    return {
        "BMR": round(bmr, 2),
        "TDEE": round(tdee, 2),
        "weight_change_kg": round(wt_change, 2),
        "days_to_target": days,
        "calorie_change_per_day": round(cal_change, 2),
        "target_calorie_per_day": round(target_cal_pd, 2),
    }

# --- Main test harness ---

if __name__ == "__main__":
    logging.info("=== Running test_calculate ===")

    sample_user = {
        "activityLevel": "Sedentary",
        "age": 41,
        "allergies": [],
        "daysWeek": 4,
        "dietRestrictions": ["none"],
        "fitnessLevel": "beginner",
        "freeTime": 4,
        "gender": "male",
        "goalTargetDate": "2025-04-22T04:48:00.000Z",
        "goalType": "weight_gain",
        "goalWeight": 65,
        "height": 170,
        "mealPrepTime": 15,
        "mealsPerDay": 5,
        "name": "wei",
        "preferredLocation": "none",
        "preferredWorkoutType": "none",
        "varietyPreferences": ["none"],
        "weight": 70
    }

    metrics = compute_user_metrics(sample_user)
    print(metrics)
    logging.info("\n=== Test complete ===")