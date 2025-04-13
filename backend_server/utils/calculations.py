import logging
from math import ceil
from datetime import datetime, timezone

def compute_user_metrics(user: dict) -> dict:
    CALORIES_PER_KG = 7700  # constant
    w, h, a = user["weight"], user["height"], user["age"]
    s = 5 if user["gender"].lower() == "male" else -161

    # 1. BMR:
    bmr = 10 * w + 6.25 * h - 5 * a + s

    # 2. TDEE:
    activity_map = {
        "sedentary": 1.2,
        "lightly active": 1.375,
        "moderately active": 1.55,
        "very active": 1.725,
        "extra active": 1.9,
    }
    act = user.get("activityLevel", "sedentary").lower()
    logging.info(f'User activity level: {act}')
    multiplier = activity_map.get(act, 1.2)
    tdee = bmr * multiplier


    # 3. Weight change & daily calorie delta:
    gw = user["goalWeight"]
    wt_change = gw - w
    today = datetime.now(timezone.utc)
    tgt = datetime.fromisoformat(user["goalTargetDate"].replace("Z", "+00:00"))
    if tgt.tzinfo is None:
        tgt = tgt.replace(tzinfo=timezone.utc)
    delta = tgt - today
    days = max(ceil(delta.total_seconds() / 86400), 1)
    cal_delta = CALORIES_PER_KG * wt_change / days

    target_cal_pd = tdee + cal_delta

    return {
        "BMR": round(bmr, 2),
        "TDEE": round(tdee, 2),
        "weight_change_kg": round(wt_change, 2),
        "days_to_target": days,
        "calorie_change_per_day": round(cal_delta, 2),
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