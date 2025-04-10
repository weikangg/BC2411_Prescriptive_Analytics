import pandas as pd
import os
import numpy as np

def load_data(file_path, target_folder=None, target_filename=None):
    if os.path.isdir(file_path):
        if target_filename:
            full_path = os.path.join(file_path, target_filename)
            if not os.path.exists(full_path) or not os.path.isfile(full_path):
                raise FileNotFoundError(f"Target file '{target_filename}' not found in {file_path}.")
            return pd.read_csv(full_path)
        if target_folder:
            folder_to_use = os.path.join(file_path, target_folder)
            if not os.path.exists(folder_to_use) or not os.path.isdir(folder_to_use):
                raise FileNotFoundError(f"Target folder '{target_folder}' not found in {file_path}.")
            csv_files = [os.path.join(folder_to_use, f) for f in os.listdir(folder_to_use)
                         if os.path.isfile(os.path.join(folder_to_use, f)) and f.lower().endswith('.csv')]
        else:
            csv_files = []
            for root, _, files in os.walk(file_path):
                for f in files:
                    if f.lower().endswith('.csv'):
                        csv_files.append(os.path.join(root, f))
        if not csv_files:
            raise FileNotFoundError(f"No CSV files found in {file_path}.")
        dfs = [pd.read_csv(csv_file) for csv_file in csv_files]
        return pd.concat(dfs, ignore_index=True)
    return pd.read_csv(file_path)

def clean_keto_diet_data(df: pd.DataFrame) -> pd.DataFrame:
    keep_cols = [
        "recipe",
        "category",
        "prep_time_in_minutes",
        "cook_time_in_minutes",
        "serving",
        "calories",
        "fat_in_grams",
        "carbohydrates_in_grams",
        "protein_in_grams",
    ]
    df = df[keep_cols]

     # Drop serving and category columns
    df = df.drop(columns=["serving", "category"], errors="ignore")
    
    # Create total_time column as sum of prep_time and cook_time, then drop them
    df["total_time_in_minutes"] = df["prep_time_in_minutes"].fillna(0) + df["cook_time_in_minutes"].fillna(0)
    df = df.drop(columns=["prep_time_in_minutes", "cook_time_in_minutes"], errors="ignore")
    
    # Introduce diet_type as "keto"
    df["diet_type"] = "keto"
    
    # Randomize cuisine_type from a given list
    cuisine_choices = ['indian', 'mediterranean', 'eastern europe', 'american', 'central europe',
                     'south east asian', 'italian', 'mexican', 'kosher', 'nordic', 'french',
                     'chinese', 'british', 'caribbean', 'south american', 'middle eastern', 'asian',
                     'japanese', 'world']
    df["cuisine_type"] = np.random.choice(cuisine_choices, size=len(df))
    
    # Rename nutritional columns for consistency
    rename_map = {
        "fat_in_grams": "fat",
        "carbohydrates_in_grams": "carbs",
        "protein_in_grams": "protein"
    }
    df.rename(columns=rename_map, inplace=True)
    
    # Remove any non-ASCII characters from text columns
    df = df.apply(lambda x: x.str.encode('ascii', 'ignore').str.decode('ascii') if x.dtype == "object" else x)
        
    # Define final desired column order.
    desired_cols = ["recipe", "diet_type", "cuisine_type", "total_time_in_minutes",
                    "calories", "fat", "carbs", "protein"]

    for col in desired_cols:
        if col not in df.columns:
            df[col] = None
    df = df[desired_cols]
    return df.reset_index(drop=True)

def clean_diets_recipes_and_nutrients_data(df: pd.DataFrame) -> pd.DataFrame:
    # Drop extraction day and time
    df = df.drop(columns=["Extraction_day", "Extraction_time"], errors='ignore')
    
    # Rename nutritional and recipe columns for consistency
    rename_map = {
        "Protein(g)": "protein",
        "Carbs(g)": "carbs",
        "Fat(g)": "fat",
        "Recipe_name": "recipe"
    }
    df.rename(columns=rename_map, inplace=True)
    
    # Calculate calories: protein*4 + carbs*4 + fat*9
    df["calories"] = df["protein"] * 4 + df["carbs"] * 4 + df["fat"] * 9
    
    # Remove any non-ASCII characters from text columns
    df = df.apply(lambda x: x.str.encode('ascii', 'ignore').str.decode('ascii') if x.dtype == "object" else x)
    
    # Simulate a realistic prep time (in minutes); e.g., random between 20 and 60 minutes.
    df["total_time_in_minutes"] = np.random.randint(20, 61, size=len(df))
    
    # Standardize diet_type and cuisine_type if present (lowercase them)
    if "Diet_type" in df.columns:
        df.rename(columns={"Diet_type": "diet_type"}, inplace=True)
        df["diet_type"] = df["diet_type"].str.lower()
    if "Cuisine_type" in df.columns:
        df.rename(columns={"Cuisine_type": "cuisine_type"}, inplace=True)
        df["cuisine_type"] = df["cuisine_type"].str.lower()
    
    # For merging, define final column order.
    desired_cols = ["recipe", "diet_type", "cuisine_type", "total_time_in_minutes", "calories", "fat", "carbs", "protein"]
    for col in desired_cols:
        if col not in df.columns:
            df[col] = None
    df = df[desired_cols]
    return df.reset_index(drop=True)

def clean_best_exercises_data(df: pd.DataFrame) -> pd.DataFrame:
    keep_cols = [
        "Name of Exercise",
        "Sets",
        "Reps",
        "Benefit",
        "Burns Calories (per 30 min)",
        "Target Muscle Group",
        "Equipment Needed",
        "Difficulty Level"
    ]
    df = df[keep_cols]

    rename_map = {
        "Name of Exercise": "exercise_name",
        "Burns Calories (per 30 min)": "cal_per_30_min",
        "Target Muscle Group": "target_muscle",
        "Difficulty Level": "difficulty"
    }
    df.rename(columns=rename_map, inplace=True)

    # Convert numeric columns
    numeric_cols = ["Sets", "Reps", "cal_per_30_min"]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df.dropna(subset=numeric_cols, inplace=True)

    return df.reset_index(drop=True)

def clean_activity_calories_data(df: pd.DataFrame) -> pd.DataFrame:
    rename_map = {"Activity, Exercise or Sport (1 hour)": "activity_per_hour"}
    df.rename(columns=rename_map, inplace=True)

    # Ensure numeric conversion for the weight columns and the "Calories per kg" column
    numeric_cols = ["130 lb", "155 lb", "180 lb", "205 lb", "Calories per kg"]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
    df.dropna(subset=numeric_cols, inplace=True)

    return df.reset_index(drop=True)


def clean_gym_members_exercise_data(df: pd.DataFrame) -> pd.DataFrame:
    # Keep relevant columns
    keep_cols = [
        "Age",
        "Gender",
        "Weight (kg)",
        "Height (m)",
        "Max_BPM",
        "Avg_BPM",
        "Resting_BPM",
        "Session_Duration (hours)",
        "Calories_Burned",
        "Workout_Type",
        "Fat_Percentage",
        "Water_Intake (liters)",
        "Workout_Frequency (days/week)",
        "Experience_Level",
        "BMI"
    ]
    df = df[keep_cols]

    # Convert numeric columns
    numeric_cols = [
        "Age", "Weight (kg)", "Height (m)", "Max_BPM", "Avg_BPM",
        "Resting_BPM", "Session_Duration (hours)", "Calories_Burned",
        "Fat_Percentage", "Water_Intake (liters)", "Workout_Frequency (days/week)",
        "Experience_Level", "BMI"
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df.dropna(subset=numeric_cols, inplace=True)

    return df.reset_index(drop=True)

def clean_data(df: pd.DataFrame, dataset_key: str) -> pd.DataFrame:
    if dataset_key == "keto_diet":
        return clean_keto_diet_data(df)
    elif dataset_key == "diets_recipes_and_nutrients":
        return clean_diets_recipes_and_nutrients_data(df)
    elif dataset_key == "best_50_exercises":
        return clean_best_exercises_data(df)
    elif dataset_key == "calories_burned_during_exercise_and_activities":
        return clean_activity_calories_data(df)
    elif dataset_key == "gym_members_exercise":
        return clean_gym_members_exercise_data(df)
    else:
        raise ValueError(f"Unsupported dataset key: {dataset_key}")


def print_null_summary(df: pd.DataFrame, dataset_name: str) -> None:
    null_summary = df.isnull().sum()
    print(f"Null value summary for {dataset_name}:")
    print(null_summary)
    print("-" * 50)

def save_processed_data(df: pd.DataFrame, filename="clean_exercise_data.csv"):
    df.to_csv(filename, index=False)
    print(f"Cleaned data saved to: {filename}")
