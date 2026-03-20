from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import WorkoutSession, WorkoutSessionCreate

router = APIRouter()

@router.post("/workout-session", response_model=WorkoutSession)
def create_workout_session(workout_session: WorkoutSessionCreate, session: Session = Depends(get_session)):
    item = WorkoutSession.model_validate(workout_session)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@router.get("/workout-sessions", response_model=list[WorkoutSession])
def get_workout_session(session: Session = Depends(get_session)):
    items = session.exec(select(WorkoutSession)).all()
    return items
