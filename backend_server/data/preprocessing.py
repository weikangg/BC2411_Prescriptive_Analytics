import pandas as pd
import logging
from pathlib import Path

# --- Determine the directory this file lives in ---
DATA_DIR = Path(__file__).resolve().parent

# --- Load your CSVs from that directory, no matter where you run from ---
_diets_df = pd.read_csv(DATA_DIR / "processed_final_diets.csv")
_ex_df    = pd.read_csv(DATA_DIR / "processed_final_exercises.csv")

def filter_diets(user_params: dict) -> pd.DataFrame:
    df = _diets_df.copy()
    # dietRestrictions → diet_type
    dr = [d.lower() for d in user_params.get("dietRestrictions", [])]
    if "none" not in dr:
        df = df[df["diet_type"].str.lower().isin(dr)]
    # varietyPreferences → cuisine_type
    vp = [v.lower() for v in user_params.get("varietyPreferences", [])]
    if "none" not in vp:
        df = df[df["cuisine_type"].str.lower().isin(vp)]
    logging.info("Filtered diets (%d rows):\n%s", len(df), df.head().to_dict(orient="records"))
    return df

def filter_exercises(user_params: dict) -> pd.DataFrame:
    df = _ex_df.copy()
    # fitnessLevel → difficulty_level
    fl = user_params.get("fitnessLevel", "").lower()
    if fl and fl != "none":
        df = df[df["difficulty_level"].str.lower() == fl]
    # preferredLocation → workout_location
    pl = user_params.get("preferredLocation", "").lower()
    if pl and pl != "none":
        df = df[df["workout_location"].str.lower() == pl]
    # preferredWorkoutType → activity_type
    wt = user_params.get("preferredWorkoutType", "").lower()
    if wt and wt != "none":
        df = df[df["activity_type"].str.lower() == wt]
    logging.info("Filtered exercises (%d rows):\n%s", len(df), df.head().to_dict(orient="records"))
    return df

# --- Main test harness ---

if __name__ == "__main__":
    logging.info("=== Running test_preprocess ===")
    sample_user = {
        "activityLevel": "Sedentary",
        "age": 41,
        "allergies": [],
        "daysWeek": 4,
        "dietRestrictions": ["keto"],
        "fitnessLevel": "intermediate",
        "freeTime": 4,
        "gender": "male",
        "goalTargetDate": "2025-04-22T04:48:00.000Z",
        "goalType": "weight_gain",
        "goalWeight": 75,
        "height": 170,
        "mealPrepTime": 15,
        "mealsPerDay": 5,
        "name": "wei",
        "preferredLocation": "home",
        "preferredWorkoutType": "general",
        "varietyPreferences": ["none"],
        "weight": 70
    }

    # 1) Filter diets
    diets_df = filter_diets(sample_user)
    # 2) Filter exercises
    ex_df = filter_exercises(sample_user)
    print(diets_df.head())
    print(len(diets_df))

    print(len(ex_df))
    print(ex_df.head())
    logging.info("\n=== Test complete ===")