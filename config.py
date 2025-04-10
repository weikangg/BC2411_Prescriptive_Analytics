import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')
RAW_DATA_DIR = os.path.join(DATA_DIR, 'raw')
INTERIM_DATA_DIR = os.path.join(DATA_DIR, 'interim')
PROCESSED_DATA_DIR = os.path.join(DATA_DIR, 'processed')
FINAL_DATA_DIR = os.path.join(DATA_DIR, 'final')

# Set kaggle API Key directory
os.environ["KAGGLE_CONFIG_DIR"] = os.path.abspath(".")
os.environ['KAGGLEHUB_CACHE'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'raw')

KAGGLE_DATASETS = {
    "best_50_exercises": "prajwaldongre/best-50-exercise-for-your-body",
    "keto_diet": "hamadkhan345/keto-diet-recipes-dataset",
    "diets_recipes_and_nutrients": "thedevastator/healthy-diet-recipes-a-comprehensive-dataset"
}
