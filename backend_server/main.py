from fastapi import FastAPI
from .routers import user_input

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}