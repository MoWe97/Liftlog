from fastapi import FastAPI
from contextlib import asynccontextmanager
from database import create_tables
from routers import exercises, workout_types, workout_sessions, session_exercise, sets
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(exercises.router)
app.include_router(workout_types.router)
app.include_router(workout_sessions.router)
app.include_router(session_exercise.router)
app.include_router(sets.router)


@app.get("/")
def root():
    return {"message": "LiftLog API"}
