import os
from backend.data_import.kaggle_import import download_dataset, view_data
from backend.data_cleaning.data_cleaning import load_data, clean_data, print_null_summary, save_processed_data
from config import KAGGLE_DATASETS, PROCESSED_DATA_DIR


def main():
    os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
    for key in KAGGLE_DATASETS:
        print(f"Processing dataset for key: {key}")
        raw_file_path = download_dataset(key)

        # For a special folder structure (example: food_nutrition stored in a subfolder)
        if key == "food_nutrition":
            df_raw = load_data(raw_file_path, target_folder="FINAL FOOD DATASET")
        else:
            df_raw = load_data(raw_file_path)

        # Print initial null-summary for the raw data
        print_null_summary(df_raw, f"{key} Raw Data")

        # Clean the data according to dataset type (key)
        try:
            df_clean = clean_data(df_raw, key)
        except ValueError as e:
            print(f"Skipping cleaning for dataset key '{key}': {e}")
            continue

        # Print summary of null values post cleaning
        print_null_summary(df_clean, f"{key} Clean Data")

        # Save cleaned data to CSV
        output_file = os.path.join(PROCESSED_DATA_DIR, f"processed_{key}.csv")
        save_processed_data(df_clean, output_file)
        print(f"Finished processing dataset '{key}'\n")


if __name__ == '__main__':
    main()
