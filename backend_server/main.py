from fastapi import FastAPI
from routers.optimize import router as optimize_router

app = FastAPI()

app.include_router(optimize_router, prefix="", tags=["optimize"])

@app.get("/")
async def root():
    return {"message": "Hello World"}

