# routers/optimize.py

import logging
from fastapi import APIRouter, HTTPException
from models.input_schema import UserData
from models.output_schema import OptimizationResult
from optimization.optimizer import simulated_optimization_result
from data.preprocessing import filter_data

router = APIRouter()

# Configure logging (this could be configured globally instead)
logging.basicConfig(level=logging.INFO)

@router.post("/optimize", response_model=OptimizationResult)
async def optimize(user_data: UserData):
    try:
        # Log the input received from the frontend
        logging.info("\nReceived user input: %s", user_data.model_dump())

        # Filter the CSV data based on user input
        filtered_data = filter_data(user_data.model_dump())

        result = simulated_optimization_result()

        # Log the output that will be returned
        logging.info("\nOptimization result: %s", result)

        return {"plan": result}
    except Exception as e:
        # Optionally log the error details
        logging.error("Error during optimization: %s", str(e))
        raise HTTPException(status_code=500, detail=str(e))
