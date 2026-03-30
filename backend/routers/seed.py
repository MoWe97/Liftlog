from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models import WorkoutType, WorkoutTypeName

router = APIRouter()


@router.post("/seed")
def seed_data(session: Session = Depends(get_session)):
    for name in WorkoutTypeName:
        session.add(WorkoutType(name=name))
    session.commit()
    return {"message": "seeded successfully"}
