from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from auth import get_current_user
from models import WorkoutType, WorkoutTypeCreate, WorkoutTypeUpdate

router = APIRouter()


@router.get("/workout-types", response_model=list[WorkoutType])
def get_workout_types(session: Session = Depends(get_session), user_id: str = Depends(get_current_user)):
    items = session.exec(select(WorkoutType).where(WorkoutType.user_id == user_id)).all()
    return items


@router.post("/workout-types", response_model=WorkoutType)
def create_workout_type(workout_type: WorkoutTypeCreate, session: Session = Depends(get_session), user_id: str = Depends(get_current_user)):
    item = WorkoutType(name=workout_type.name, user_id=user_id)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.patch("/workout-types/{workout_type_id}", response_model=WorkoutType)
def update_workout_type(workout_type_id: int, update: WorkoutTypeUpdate, session: Session = Depends(get_session), user_id: str = Depends(get_current_user)):
    item = session.get(WorkoutType, workout_type_id)
    if not item:
        raise HTTPException(status_code=404, detail="WorkoutType not found")
    if item.user_id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    item.name = update.name
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.delete("/workout-types/{workout_type_id}", status_code=204)
def delete_workout_type(workout_type_id: int, session: Session = Depends(get_session), user_id: str = Depends(get_current_user)):
    item = session.get(WorkoutType, workout_type_id)
    if not item:
        raise HTTPException(status_code=404, detail="WorkoutType not found")
    if item.user_id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    session.delete(item)
    session.commit()
