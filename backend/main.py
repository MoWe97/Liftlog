from fastapi import FastAPI, Depends
from sqlmodel import Session, select
from database import get_session, create_tables
from contextlib import asynccontextmanager
from models import WorkoutType, WorkoutTypeName, WorkoutSession, WorkoutSessionCreate


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield
app = FastAPI(lifespan=lifespan)

@app.get("/")
def root():
    return {"message": "LiftLog API"}

@app.get("/workout-types", response_model=list[WorkoutType])
def get_workout_types(session: Session = Depends(get_session)):
    items = session.exec(select(WorkoutType)).all()
    return items

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

@app.post("/workout-session", response_model=WorkoutSession)
def create_workout_session(workout_session: WorkoutSessionCreate, session: Session = Depends(get_session)):
    item = WorkoutSession.model_validate(workout_session)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item
