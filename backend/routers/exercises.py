from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Exercise, ExerciseCreate, ExerciseRead, WorkoutType, ExerciseWorkoutTypeLink

router = APIRouter()


@router.post("/exercises", response_model=ExerciseRead)
def create_exercise(exercise: ExerciseCreate, session: Session = Depends(get_session)):
    workout_types = session.exec(select(WorkoutType).where(WorkoutType.id.in_(exercise.workout_types_ids))).all()
    item = Exercise(name=exercise.name, workout_types=workout_types)
    session.add(item)
    session.commit()
    session.refresh(item)
    return item


@router.get("/exercises", response_model=list[ExerciseRead])
def get_exercises(session: Session = Depends(get_session)):
    items = session.exec(select(Exercise)).all()
    return items


@router.get("/workout-types/{workout_type_id}/exercises", response_model=list[ExerciseRead])
def get_workout_type_exercises(workout_type_id: int, session: Session = Depends(get_session)):
    items = session.exec(
        select(Exercise)
        .join(ExerciseWorkoutTypeLink)
        .where(ExerciseWorkoutTypeLink.workout_type_id == workout_type_id)
    ).all()
    return items


@router.delete("/exercises/{exercise_id}", response_model=ExerciseRead)
def delete_exercise(exercise_id: int, session: Session = Depends(get_session)):
    item = session.get(Exercise, exercise_id)
    if not item:
        raise HTTPException(status_code=404, detail="Exercise not found")
    session.delete(item)
    session.commit()
    return item
