from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select
from database import get_session, create_tables
from contextlib import asynccontextmanager
from models import WorkoutType, WorkoutTypeName, WorkoutSession, WorkoutSessionCreate, Set, SetCreate, SessionExercise, \
    Exercise, ExerciseCreate, ExerciseWorkoutTypeLink, ExerciseRead
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


@app.post("/seed")
def seed_data(session: Session = Depends(get_session)):
    item = WorkoutType(name=WorkoutTypeName.PUSH)
    session.add(item)
    item = WorkoutType(name=WorkoutTypeName.PULL)
    session.add(item)
    item = WorkoutType(name=WorkoutTypeName.LEGS)
    session.add(item)
    session.commit()
    return {"message": "seeded successfully"}
