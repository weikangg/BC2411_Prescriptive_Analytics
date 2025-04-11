import os
import kagglehub
from pandasgui import show
from config import RAW_DATA_DIR, KAGGLE_DATASETS

def download_dataset(dataset_key="exercises"):
    os.makedirs(RAW_DATA_DIR, exist_ok=True)
    dataset = KAGGLE_DATASETS[dataset_key]
    path = kagglehub.dataset_download(dataset)
    return path

def view_data(df):
    show(df)

