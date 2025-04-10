# BC2411_Prescriptive_Analytics

## Pre-requisites
- Install Python Version: 3.12
- Create a virtual environment 
- Download Expo App on Google Play Store/ iOS Play Store

## Introduction to project 
1. `data/` directory is first generated from `scripts/prepare_data.py` script file which imports data from Kaggle and cleans data as well as simulate some data where not provided for the project.
2. Brief EDA is conducted in `eda/` directory to get better idea of dataset used.
3. 

## Commands to run

To run backend server in the terminal:
```
pip install -r requirements.txt
cd backend_server
fastapi dev main.py
python3 main.py
```

To run frontend mobile app in the terminal:
```
cd frontend_mobile/FitnessApp
npm i
npx expo start
```
- Then use the expo App on your phone to scan the QR Code in the terminal

## To run script to get data from kaggle
1. Get api key (kaggle.json) from kaggle website, follow instructions on kaggle website
2. Paste kaggle.json in the root directory
3. Run the following file:
```
backend/scripts/prepare_data.py
```
