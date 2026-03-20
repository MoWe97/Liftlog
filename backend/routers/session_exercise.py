from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from models import SessionExercise

router = APIRouter()

@router.post("/workout-session/{workout_session_id}/exercise/{exercise_id}/session-exercise", response_model=SessionExercise)
def create_workout_session_exercise(workout_session_id: int, exercise_id: int, session: Session = Depends(get_session)):
    item = SessionExercise.model_validate({"workout_session_id": workout_session_id, "exercise_id": exercise_id})
    session.add(item)
    session.commit()
    session.refresh(item)
    return item
