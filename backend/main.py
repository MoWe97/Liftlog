from fastapi import FastAPI, Depends
from sqlmodel import Session, select
from database import get_session, create_tables
from contextlib import asynccontextmanager
from models import WorkoutType, WorkoutTypeName, WorkoutSession, WorkoutSessionCreate, Set, SetCreate, SessionExercise


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

@app.get("/workout-session", response_model=list[WorkoutSession])
def get_workout_session(session: Session = Depends(get_session)):
    items = session.exec(select(WorkoutSession)).all()
    return items

@app.post("/workout-session/{workout_session_id}/exercise/{exercise_id}/session-exercise", response_model=SessionExercise)
def create_workout_session_exercise(workout_session_id: int, exercise_id: int, session: Session = Depends(get_session)):
    item = SessionExercise.model_validate({"workout_session_id": workout_session_id, "exercise_id": exercise_id})
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@app.post("/session-exercise/{session_exercise_id}/sets", response_model=list[Set])
def create_session_exercise_sets(session_exercise_id: int, sets: list[SetCreate], session: Session = Depends(get_session)):
    items = []
    for new_set in sets:
        item = Set.model_validate({**new_set.model_dump(),"session_exercise_id": session_exercise_id})
        session.add(item)
        items.append(item)
    session.commit()
    for item in items:
        session.refresh(item)
    return items
