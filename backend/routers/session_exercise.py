from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from auth import get_current_user
from models import WorkoutSession, SessionExercise, SessionExerciseRead, Set

router = APIRouter()


def _require_session_owner(workout_session_id: int, user_id: str, session: Session) -> WorkoutSession:
    ws = session.get(WorkoutSession, workout_session_id)
    if not ws:
        raise HTTPException(status_code=404, detail="WorkoutSession not found")
    if ws.user_id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return ws


@router.post("/workout-sessions/{workout_session_id}/exercises", response_model=SessionExerciseRead)
def create_workout_session_exercise(workout_session_id: int, exercise_id: int, session: Session = Depends(get_session), user_id: str = Depends(get_current_user)):
    _require_session_owner(workout_session_id, user_id, session)
    item = SessionExercise.model_validate({"workout_session_id": workout_session_id, "exercise_id": exercise_id})
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.delete("/session-exercises/{session_exercise_id}", status_code=204)
def delete_session_exercise(session_exercise_id: int, session: Session = Depends(get_session), user_id: str = Depends(get_current_user)):
    item = session.get(SessionExercise, session_exercise_id)
    if not item:
        raise HTTPException(status_code=404, detail="SessionExercise not found")
    _require_session_owner(item.workout_session_id, user_id, session)
    for s in session.exec(select(Set).where(Set.session_exercise_id == session_exercise_id)).all():
        session.delete(s)
    session.delete(item)
    session.commit()


@router.get("/workout-sessions/{workout_session_id}/exercises", response_model=list[SessionExerciseRead])
def get_workout_session_exercises(workout_session_id: int, session: Session = Depends(get_session), user_id: str = Depends(get_current_user)):
    _require_session_owner(workout_session_id, user_id, session)
    items = session.exec(
        select(SessionExercise)
        .where(SessionExercise.workout_session_id == workout_session_id)
    ).all()
    return items
