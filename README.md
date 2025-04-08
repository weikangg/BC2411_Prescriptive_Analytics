# BC2411_Prescriptive_Analytics

## Pre-requisites
- Install Python Version: 3.12
- Create a virtual environment 


## Commands to run
```
pip install -r requirements.txt
cd backend_server
fastapi dev main.py
python3 main.py
```

## To run script to get data from kaggle
1. Get api key (kaggle.json) from kaggle website, follow instructions on kaggle website
2. Paste kaggle.json in the root directory
3. Run the following file:
```
backend/scripts/prepare_data.py
```
