from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from datetime import date as Date
from models import WorkoutSession, WorkoutSessionCreate, WorkoutSessionRead, SessionExercise, Exercise, ExerciseWorkoutTypeLink, WorkoutType

router = APIRouter()


@router.post("/workout-sessions", response_model=WorkoutSessionRead)
def create_workout_session(workout_session: WorkoutSessionCreate, session: Session = Depends(get_session)):
    name = workout_session.name

    # If a template is chosen and no name is given, inherit the template name
    if workout_session.template_id and not name:
        template = session.get(WorkoutType, workout_session.template_id)
        if template:
            name = template.name

    item = WorkoutSession(date=workout_session.date, name=name)
    session.add(item)
    session.commit()
    session.refresh(item)

    if workout_session.template_id:
        exercises = session.exec(
            select(Exercise)
            .join(ExerciseWorkoutTypeLink)
            .where(ExerciseWorkoutTypeLink.workout_type_id == workout_session.template_id)
        ).all()
        for exercise in exercises:
            se = SessionExercise(workout_session_id=item.id, exercise_id=exercise.id)
            session.add(se)
        session.commit()
        session.refresh(item)

    return item


@router.get("/workout-sessions", response_model=list[WorkoutSessionRead])
def get_workout_sessions(date: Date = None, session: Session = Depends(get_session)):
    query = select(WorkoutSession)
    if date:
        query = query.where(WorkoutSession.date == date)
    items = session.exec(query).all()
    return items


@router.get("/workout-sessions/{workout_session_id}", response_model=WorkoutSessionRead)
def get_workout_session(workout_session_id: int, session: Session = Depends(get_session)):
    item = session.get(WorkoutSession, workout_session_id)
    if not item:
        raise HTTPException(status_code=404, detail="Session not found")
    return item


@router.delete("/workout-sessions/{workout_session_id}", status_code=204)
def delete_workout_session(workout_session_id: int, session: Session = Depends(get_session)):
    item = session.get(WorkoutSession, workout_session_id)
    if not item:
        raise HTTPException(status_code=404, detail="Session not found")
    session.delete(item)
    session.commit()
