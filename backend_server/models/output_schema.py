from pydantic import BaseModel
from datetime import date
from typing import List, Dict

class Meal(BaseModel):
    recipe: str
    calories: float
    macros: Dict[str, float]  # For example: {"carbs": 55.0, "protein": 10.0, "fat": 8.0}
    prep_time: float         # In minutes

class Exercise(BaseModel):
    name: str
    type: str
    location: str
    duration: float                # In minutes
    estimated_calories_burned: float

class DailyPlan(BaseModel):
    day: date
    selected_meals: List[Meal]
    selected_exercises: List[Exercise]
    total_time_used: float         # Combined time for meals prep and exercise (in minutes)
    total_net_calories: float      # Calculated as intake (from meals) minus calories burned (from exercise)

class OptimizationResult(BaseModel):
    plan: List[DailyPlan]