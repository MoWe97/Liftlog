import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import create_tables
from routers import exercises, workout_types, workout_sessions, session_exercise, sets


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(lifespan=lifespan)

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(exercises.router, prefix="/api")
app.include_router(workout_types.router, prefix="/api")
app.include_router(workout_sessions.router, prefix="/api")
app.include_router(session_exercise.router, prefix="/api")
app.include_router(sets.router, prefix="/api")


@app.get("/api")
def root():
    return {"message": "LiftLog API"}


dist = Path(__file__).parent.parent / "frontend" / "dist"
if dist.exists():
    app.mount("/", StaticFiles(directory=str(dist), html=True), name="static")
