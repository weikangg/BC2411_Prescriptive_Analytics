import os
import pandas as pd
from preprocessing.data_import.kaggle_import import download_dataset, view_data
from preprocessing.data_cleaning.data_cleaning import load_data, clean_data, print_null_summary, save_processed_data
from config import KAGGLE_DATASETS, PROCESSED_DATA_DIR, FINAL_DATA_DIR


def main():
    os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
    
    # Dictionary to collect processed diet datasets for later merging.
    diet_dfs = {}
    
    for key in KAGGLE_DATASETS:
        print(f"Processing dataset for key: {key}")
        raw_file_path = download_dataset(key)
        
        if key == "diets_recipes_and_nutrients":
            # For the aggregated diets, load only the file "All_Diets.csv"
            df_raw = load_data(raw_file_path, target_filename="All_Diets.csv")
        else:
            df_raw = load_data(raw_file_path)
        
        print_null_summary(df_raw, f"{key} Raw Data")
        
        try:
            df_clean = clean_data(df_raw, key)
        except ValueError as e:
            print(f"Skipping cleaning for dataset key '{key}': {e}")
            continue
        
        print_null_summary(df_clean, f"{key} Clean Data")
        
        output_file = os.path.join(PROCESSED_DATA_DIR, f"processed_{key}.csv")
        save_processed_data(df_clean, output_file)
        print(f"Finished processing dataset '{key}'\n")
        
        # If this dataset is one of our diets of interest, store it.
        if key in ["keto_diet", "diets_recipes_and_nutrients"]:
            diet_dfs[key] = df_clean

    # Final merge step: merge the two diet datasets (if both are available) using the same headers.
    if "keto_diet" in diet_dfs and "diets_recipes_and_nutrients" in diet_dfs:
        merged_df = pd.concat([diet_dfs["keto_diet"], diet_dfs["diets_recipes_and_nutrients"]], ignore_index=True)
        # Ensure the final directory exists:
        os.makedirs(FINAL_DATA_DIR, exist_ok=True)
        final_output_file = os.path.join(FINAL_DATA_DIR, "processed_final_diets.csv")
        merged_df.to_csv(final_output_file, index=False)
        print(f"Final merged diet dataset saved to {final_output_file}")
    else:
        print("Not all diet datasets were processed. Final merge skipped.")

if __name__ == '__main__':
    main()
