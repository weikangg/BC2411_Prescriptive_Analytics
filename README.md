# BC2411 Prescriptive Analytics - FitPlanner

## 🎥 Demo
<div align="center">

  [Watch the demo here](https://github.com/user-attachments/assets/48efdece-557f-4ed8-b53c-6f0edfa438a6)

</div>

## 📦 Prerequisites

- **Python Version:** 3.12
- **NodeJS**: [Download here](https://nodejs.org/en/download)
- **Gurobi Academic License**: [Request for one here](https://portal.gurobi.com/iam/licenses/request)
- **Virtual Environment:** Create and activate a virtual environment
- **Expo App:** Install from the [Google Play Store](https://play.google.com/store) or [Apple App Store](https://www.apple.com/app-store/)
- **SerpAPI:** Generate an API Key [here](https://serpapi.com/manage-api-key)

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
     - For this dataset, one particular dish `Perfectly Marinated Grilled Salmon` has a known preparation time of 0 minutes through our EDA which is not realistic, as such it is cleaned to have a reasonable prep time of 20mins.
   - The [Diets, Recipes And Their Nutrients Dataset](https://www.kaggle.com/datasets/thedevastator/healthy-diet-recipes-a-comprehensive-dataset) from Kaggle
     - For this dataset, the amount of calories calculated doesn't seem to be realistic for a single serving of a meal. The average calories of a meal calculated was 1895.552408 kcal, which is unrealistic as most meals are within the range of 300-800 calories. As such, for these meals, the data cleaning conducted was to pick a random number from 600-800kcal, and scale down the macronutrients respectively as well to get a realistic simulated dataset.
   - Some columns such as `cuisine_type` and `total_time_in_minutes` are reasonably simulated to allow merging both datasets and to fulfill the LOP requirements.

4. The exercise dataset is based on:

   - The [Best 50 Exercise for your body](https://www.kaggle.com/datasets/prajwaldongre/best-50-exercise-for-your-body) dataset from Kaggle
   - Supplementary data from [Harvard Health](https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-for-people-of-three-different-weights)
   - Some columns such as `calories_burned_per_min` are estimated by dividing `calories_burned_per_30min` by 30.
   - `workout_location` is derived from the original `Equipment Needed` column.
   - `Activity_type` is inferred using ChatGPT.
   - The combined dataset was cleaned and pre-processed with assistance from ChatGPT.  
     👉 [ChatGPT conversation link](https://chatgpt.com/share/67f7fe15-7bbc-8013-8777-12f57b035c1d)

5. As such, final datasets for both exercise and diet are derived from Kaggle sources and enhanced with simulated data.

### Model Formulation
The implementation of the detailed formulation of the model can be found at `preprocessing/model_optimization/model.ipynb`. Within this file, you can also find:
1. Helper functions used to calculate key information such as a user's BMR, TDEE.
2. Functions to solve the model.
3. Functions to provide recommendations based on infeasibility of solution to the user.
4. Analysis of solutions including test cases for infeasible user input such as attempting to lose 20kg in a span of 3 days.
---

## 🖥️ How to Run the Application

### 🔧 Backend (API Server)

In the terminal:

```
pip install -r requirements.txt
cd backend_server
uvicorn main:app --reload --host 0.0.0.0
```

### Frontend mobile app

Take note to get Serp API Key from the website stated above in Prerequisites section. This is just for the image generation according to foods & recipes recommended from the Gurobi optimization model. Then, create a `.env` file just like `.env.sample` in `frontend_mobile/FitnessApp` directory.

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

## Commands ran from project root directory to deploy backend on AWS

- These commands were for previously when deployment was done manually, now deployment is automated when there are new changes pushed to the main branch of this repository. One can reference the yaml file [here](https://github.com/weikangg/BC2411_Prescriptive_Analytics/actions/runs/14421469397/workflow). The AWS secrets have to be added before it can be ran successfully.
- Note: The first docker build command requires you to acquire the WLS Academic Gurobi license [here](https://portal.gurobi.com/iam/licenses/request/?type=academic), to automate deployment I added it to Github secrets as well: 
```
docker build --build-arg GUROBI_LIC="$(cat gurobi.lic)" -t fitness-planner .
docker tag fitness-planner:latest 144851568201.dkr.ecr.ap-southeast-1.amazonaws.com/bc2411/fitness-planner:latest
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --pass
word-stdin 144851568201.dkr.ecr.ap-southeast-1.amazonaws.com
docker push 144851568201.dkr.ecr.ap-southeast-1.amazonaws.com/bc2411/fitness-planner:latest
aws ecs register-task-definition --cli-input-json file://task-definition.json
aws ecs create-service --cluster fitness_planner --service-name fitness_planner_service --task-definition fitness-planner-task --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

- Backend deployed on : http://13.215.183.140:8000/docs
