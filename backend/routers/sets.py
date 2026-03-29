from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Set, SetCreate

router = APIRouter()

@router.post("/session-exercise/{session_exercise_id}/sets", response_model=list[Set])
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

@router.get("/session-exercise/{session_exercise_id}/sets", response_model=list[Set])
def get_session_exercise_sets(session_exercise_id: int, session: Session = Depends(get_session)):
    items = session.exec(
        select(Set)
        .where(Set.session_exercise_id == session_exercise_id)
    ).all()
    return items

@router.delete("/sets/{set_id}", response_model=Set)
def delete_set(set_id: int, session: Session = Depends(get_session)):
    item = session.get(Set, set_id)
    if not item:
        raise HTTPException(status_code=404, detail="Set not found")
    session.delete(item)
    session.commit()
    return item
