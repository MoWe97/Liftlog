from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select
from database import get_session
from datetime import date as Date
from models import WorkoutSession, WorkoutSessionCreate, WorkoutSessionRead

router = APIRouter()

@router.post("/workout-session", response_model=WorkoutSessionRead)
def create_workout_session(workout_session: WorkoutSessionCreate, session: Session = Depends(get_session)):
    item = WorkoutSession.model_validate(workout_session)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@router.get("/workout-session/{workout_session_id}", response_model=WorkoutSessionRead)
def get_workout_session(workout_session_id: int, session: Session = Depends(get_session)):
    item = session.get(WorkoutSession, workout_session_id)
    if not item:
        raise HTTPException(status_code=404, detail="Session not found")
    return item

@router.get("/workout-sessions", response_model=list[WorkoutSessionRead])
def get_workout_sessions(date: Date = None, session: Session = Depends(get_session)):
    query = select(WorkoutSession)
    if date:
        query = query.where(WorkoutSession.date == date)
    items = session.exec(query).all()
    return items

@router.delete("/workout-session/{workout_session_id}", response_model=WorkoutSession)
def delete_workout_session(workout_session_id: int, session: Session = Depends(get_session)):
    item = session.get(WorkoutSession, workout_session_id)
    if not item:
        raise HTTPException(status_code=404, detail="Session not found")
    session.delete(item)
    session.commit()
    return item
