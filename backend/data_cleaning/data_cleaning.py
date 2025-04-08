import pandas as pd
import os

def load_data(file_path, target_folder=None):
    if os.path.isdir(file_path):
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
        "id",
        "recipe",
        "category",
        "prep_time_in_minutes",
        "cook_time_in_minutes",
        "difficulty",
        "serving",
        "calories",
        "fat_in_grams",
        "carbohydrates_in_grams",
        "protein_in_grams",
    ]
    df = df[keep_cols]

    rename_map = {
        "fat_in_grams": "fat",
        "carbohydrates_in_grams": "carbs",
        "protein_in_grams": "protein"
    }
    df.rename(columns=rename_map, inplace=True)

    df.dropna(subset=["calories", "fat", "carbs", "protein"], inplace=True)

    numeric_cols = ["prep_time_in_minutes", "cook_time_in_minutes", "serving",
                    "calories", "fat", "carbs", "protein"]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df.dropna(subset=numeric_cols, inplace=True)

    return df.reset_index(drop=True)

def clean_nutrition_data(df: pd.DataFrame) -> pd.DataFrame:
    drop_cols = ["Unnamed: 0.1", "Unnamed: 0"]
    for c in drop_cols:
        if c in df.columns:
            df.drop(columns=[c], inplace=True)

    rename_map = {
        "Caloric Value": "calories",
        "Fat": "fat",
        "Carbohydrates": "carbs",
        "Protein": "protein"
    }
    df.rename(columns=rename_map, inplace=True)

    keep_cols = [
        "food",
        "calories",
        "fat",
        "carbs",
        "protein",
        # Uncomment or add any other columns as needed:
        # "Sugars", "Dietary Fiber", "Sodium", etc.
    ]
    existing_keep_cols = [c for c in keep_cols if c in df.columns]
    df = df[existing_keep_cols]

    df.dropna(subset=["food", "calories", "fat", "carbs", "protein"], inplace=True)

    numeric_cols = ["calories", "fat", "carbs", "protein"]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df.dropna(subset=numeric_cols, inplace=True)

    return df.reset_index(drop=True)

def clean_data(df: pd.DataFrame, dataset_type: str) -> pd.DataFrame:
    if dataset_type == "keto_diet":
        return clean_keto_diet_data(df)
    elif dataset_type == "food_nutrition":
        return clean_nutrition_data(df)
    else:
        raise ValueError(f"Unsupported dataset type: {dataset_type}")

def print_null_summary(df: pd.DataFrame, dataset_name: str) -> None:
    null_summary = df.isnull().sum()
    print(f"Null value summary for {dataset_name}:")
    print(null_summary)
    print("-" * 50)

def save_processed_data(df: pd.DataFrame, filename="clean_exercise_data.csv"):
    df.to_csv(filename, index=False)
    print(f"Cleaned data saved to: {filename}")
