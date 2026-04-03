from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import WorkoutType, WorkoutTypeCreate

router = APIRouter()


@router.get("/workout-types", response_model=list[WorkoutType])
def get_workout_types(session: Session = Depends(get_session)):
    items = session.exec(select(WorkoutType)).all()
    return items


@router.post("/workout-types", response_model=WorkoutType)
def create_workout_type(workout_type: WorkoutTypeCreate, session: Session = Depends(get_session)):
    item = WorkoutType(name=workout_type.name)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item
