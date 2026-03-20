from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import WorkoutType

router = APIRouter()

@router.get("/workout-types", response_model=list[WorkoutType])
def get_workout_types(session: Session = Depends(get_session)):
    items = session.exec(select(WorkoutType)).all()
    return items
