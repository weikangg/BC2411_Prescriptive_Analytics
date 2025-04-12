import logging
from fastapi import APIRouter, HTTPException
from models.input_schema import UserData
from models.output_schema import OptimizationResult
from optimization.optimizer import simulated_optimization_result
from data.preprocessing import filter_diets, filter_exercises
from utils.calculations import compute_user_metrics

router = APIRouter()
logging.basicConfig(level=logging.INFO)

@router.post("/optimize", response_model=OptimizationResult, tags=["optimize"])
async def optimize(user_data: UserData):
    try:
        params = user_data.model_dump()
        logging.info("Received user input:\n%s", params)

        # 1. Filter diets & exercises
        diets = filter_diets(params)
        print(diets.head())
        print(len(diets))

        exercises = filter_exercises(params)
        print(exercises.head())
        print(len(exercises))

        # 2. Compute BMR/TDEE/etc.
        metrics = compute_user_metrics(params)
        logging.info("Computed user metrics:\n%s", metrics)

        # 3. (later) call your real optimizer; for now simulate
        plan = simulated_optimization_result()

        return {"plan": plan}

    except Exception as e:
        logging.error("Error during optimization: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))