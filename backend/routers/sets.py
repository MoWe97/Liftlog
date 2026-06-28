from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from auth import get_current_user
from models import WorkoutSession, SessionExercise, Set, SetCreate, SetRead, SetUpdate

router = APIRouter()


def _require_session_exercise_owner(session_exercise_id: int, user_id: str, session: Session) -> SessionExercise:
    se = session.get(SessionExercise, session_exercise_id)
    if not se:
        raise HTTPException(status_code=404, detail="SessionExercise not found")
    ws = session.get(WorkoutSession, se.workout_session_id)
    if not ws or ws.user_id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return se


@router.post("/session-exercise/{session_exercise_id}/sets", response_model=list[SetRead])
def create_session_exercise_sets(session_exercise_id: int, sets: list[SetCreate], session: Session = Depends(get_session), user_id: str = Depends(get_current_user)):
    _require_session_exercise_owner(session_exercise_id, user_id, session)
    items = []
    for new_set in sets:
        item = Set.model_validate({**new_set.model_dump(), "session_exercise_id": session_exercise_id})
        session.add(item)
        items.append(item)
    session.commit()
    for item in items:
        session.refresh(item)
    return items


@router.get("/session-exercise/{session_exercise_id}/sets", response_model=list[SetRead])
def get_session_exercise_sets(session_exercise_id: int, session: Session = Depends(get_session), user_id: str = Depends(get_current_user)):
    _require_session_exercise_owner(session_exercise_id, user_id, session)
    items = session.exec(
        select(Set)
        .where(Set.session_exercise_id == session_exercise_id)
        .order_by(Set.id)
    ).all()
    return items


@router.delete("/sets/{set_id}", response_model=SetRead)
def delete_set(set_id: int, session: Session = Depends(get_session), user_id: str = Depends(get_current_user)):
    item = session.get(Set, set_id)
    if not item:
        raise HTTPException(status_code=404, detail="Set not found")
    _require_session_exercise_owner(item.session_exercise_id, user_id, session)
    session.delete(item)
    session.commit()
    return item


@router.patch("/sets/{set_id}", response_model=SetRead)
def update_set(set_id: int, set_update: SetUpdate, session: Session = Depends(get_session), user_id: str = Depends(get_current_user)):
    item = session.get(Set, set_id)
    if not item:
        raise HTTPException(status_code=404, detail="Set not found")
    _require_session_exercise_owner(item.session_exercise_id, user_id, session)
    update_data = set_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item
