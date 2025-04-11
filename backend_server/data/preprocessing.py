import pandas as pd
import logging
# Load the CSV files once (you may choose to cache these globally or load per request if the files are small)
data1 = pd.read_csv("../data/final/processed_final_diets.csv")
data2 = pd.read_csv("../data/final/processed_final_exercises.csv")

def filter_data(user_params: dict) -> pd.DataFrame:
    # Example filtering using boolean indexing:
    # Adjust the field names according to the CSV headers and request parameters.
    # df_filtered = data1[
    #     (data1['activityLevel'] == user_params.get('activityLevel')) &
    #     (data1['goalType'] == user_params.get('goalType'))
    # ]
    df_filtered = user_params.copy()
    logging.basicConfig(level=logging.INFO)
    logging.info("Filtering data with parameters: %s", df_filtered)
    # You can also merge or further filter with data2 if needed.
    return df_filtered
