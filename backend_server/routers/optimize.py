import logging
from fastapi import APIRouter, HTTPException
from optimization.optimizer import solve_optimization

router = APIRouter()
logging.basicConfig(level=logging.INFO)

@router.post("/optimize", response_model=OptimizationResult, tags=["optimize"])
async def optimize(user_data: UserData):
    try:
        params = user_data.model_dump()
        logging.info("Received user input:\n%s", params)

        detailed_result = solve_optimization(params)

        return detailed_result

    except Exception as e:
        logging.error("Error during optimization: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))