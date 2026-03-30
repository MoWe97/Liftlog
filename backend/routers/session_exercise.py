from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from models import SessionExercise, SessionExerciseRead

router = APIRouter()


@router.post("/workout-sessions/{workout_session_id}/exercises", response_model=SessionExerciseRead)
def create_workout_session_exercise(workout_session_id: int, exercise_id: int, session: Session = Depends(get_session)):
    item = SessionExercise.model_validate({"workout_session_id": workout_session_id, "exercise_id": exercise_id})
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.get("/workout-sessions/{workout_session_id}/exercises", response_model=list[SessionExerciseRead])
def get_workout_session_exercises(workout_session_id: int, session: Session = Depends(get_session)):
    items = session.exec(
        select(SessionExercise)
        .where(SessionExercise.workout_session_id == workout_session_id)
    ).all()
    return items
