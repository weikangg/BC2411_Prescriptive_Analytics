from pydantic import BaseModel
from datetime import date
from typing import List, Dict

class Meal(BaseModel):
    recipe: str
    calories: float
    macros: Dict[str, float]  # e.g. {"carbs": 55.0, "protein": 10.0, "fat": 8.0}
    total_time: float         # In minutes

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
    total_time_used: float         # Combined time for meal prep and exercise (in minutes)
    total_net_calories: float      # Intake (from meals) minus calories burned (from exercise)

class WeeklyInfo(BaseModel):
    free_time_week: float             # Total free time available per week (in minutes)
    avg_free_time_used: float         # Average total time used per day (in minutes)
    avg_workout_duration: float       # Average workout duration per day (in minutes)
    meals_per_day: float              # Meals per day (as provided)
    avg_net_calories: float           # Average net calories per day

class OptimizationResult(BaseModel):
    plan: List[DailyPlan]
    weekly_info: WeeklyInfo
    status: str                     # The Gurobi model status (e.g., "OPTIMAL", "TIME_LIMIT", "INFEASIBLE")
    recommendations: List[str]      # List of recommendations to adjust backend inputs if needed