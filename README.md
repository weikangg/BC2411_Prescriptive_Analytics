# BC2411 Prescriptive Analytics

## 📦 Prerequisites

- **Python Version:** 3.12
- **Virtual Environment:** Create and activate a virtual environment
- **Expo App:** Install from the [Google Play Store](https://play.google.com/store) or [Apple App Store](https://www.apple.com/app-store/)

---

## 📘 Project Overview

This project aims to create a prescriptive analytics tool using dietary and exercise datasets, combining real-world and simulated data to produce actionable insights through a Linear Optimization Model.

### 🔹 Data Preparation

1. The `data/` directory is generated by running the `scripts/prepare_data.py` script. This script:

   - Downloads datasets from Kaggle
   - Cleans and preprocesses the data
   - Simulates missing data where needed

2. Exploratory Data Analysis (EDA) is performed in the `eda/` directory to better understand the structure and quality of the final diet dataset.

3. The diet and foods dataset is based on:

   - The [Keto Diet Recipes Dataset](https://www.kaggle.com/datasets/hamadkhan345/keto-diet-recipes-dataset?resource=download) from Kaggle
   - The [Diets, Recipes And Their Nutrients Dataset](https://www.kaggle.com/datasets/thedevastator/healthy-diet-recipes-a-comprehensive-dataset) from Kaggle
   - Some columns such as `cuisine_type` and `total_time_in_minutes` are reasonably simulated to allow merging both datasets and to fulfill the LOP requirements

4. The exercise dataset is based on:

   - The [Best 50 Exercise for your body](https://www.kaggle.com/datasets/prajwaldongre/best-50-exercise-for-your-body) dataset from Kaggle
   - Supplementary data from [Harvard Health](https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-for-people-of-three-different-weights)
   - Some columns such as `calories_burned_per_min` are estimated by dividing `calories_burned_per_30min` by 30.
   - `workout_location` is derived from the original `Equipment Needed` column.
   - `Activity_type` is inferred using ChatGPT.
   - The combined dataset was cleaned and pre-processed with assistance from ChatGPT.  
     👉 [ChatGPT conversation link](https://chatgpt.com/share/67f7fe15-7bbc-8013-8777-12f57b035c1d)

5. As such, final datasets for both exercise and diet are derived from Kaggle sources and enhanced with simulated data.

---

## 🖥️ How to Run the Application

### 🔧 Backend (API Server)

In the terminal:

```
pip install -r requirements.txt
cd backend_server
uvicorn main:app --reload --host 0.0.0.0
```

To run frontend mobile app in the terminal:

```
cd frontend_mobile/FitnessApp
npm i
npx expo install @react-native-community/slider
npx expo install @react-native-picker/picker
npx expo start
```

To start frontend mobile app for everyone and to share the app instead:

```
npx expo start --tunnel
```

- Then, open the Expo App on your phone and scan the QR code displayed in the terminal.

## To run script to get data from kaggle

1. Download your `kaggle.json` API key from your Kaggle account settings
2. Place the `kaggle.json` file in the root directory of the project
3. Run the data preparation script:

```
backend/scripts/prepare_data.py
```

## Commands ran to deploy backend on AWS in the root directory

```
docker build -t fitness-planner .
docker tag fitness-planner:latest xxx.dkr.ecr.ap-southeast-1.amazonaws.com/bc2411/fitness-planner:latest
docker push xxx.dkr.ecr.ap-southeast-1.amazonaws.com/bc2411/fitness-planner:latest
aws ecs register-task-definition --cli-input-json file://task-definition.json
aws ecs create-service --cluster fitness_planner --service-name fitness_planner_service --task-definition fitness-planner-task --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```
