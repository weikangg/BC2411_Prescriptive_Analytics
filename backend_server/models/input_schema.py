# app/models/input_schema.py

from pydantic import BaseModel, conint, confloat, field_validator, Field
from typing import List, Annotated
class UserData(BaseModel):
    name: str
    age: Annotated[int, Field(strict=True, gt=0)]
    gender: str
    height: Annotated[int, Field(strict=True, gt=0)]
    weight: Annotated[int, Field(strict=True, gt=0, lt=200)]
    activityLevel: str
    freeTime: Annotated[int, Field(strict=True, ge=0)]
    daysWeek: Annotated[int, Field(strict=True, ge=1,le=7)]
    goalType: str
    goalWeight: Annotated[int, Field(strict=True, gt=0, lt=200)]
    goalTargetDate: str
    fitnessLevel: str
    preferredLocation: str
    preferredWorkoutType: str
    dietRestrictions: List[str]
    mealPrepTime: Annotated[int, Field(strict=True, gt=0, le=120)]
    mealsPerDay: Annotated[int, Field(strict=True, gt=0)]
    varietyPreferences: List[str]

    @field_validator("gender")
    def validate_gender(cls, v):
        if v.lower() not in ["male", "female", "other"]:
            raise ValueError("Invalid gender value")
        return v
