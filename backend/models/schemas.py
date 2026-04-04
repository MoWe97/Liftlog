from sqlmodel import SQLModel
from typing import Optional
from datetime import date
from models.tables import WorkoutType  # used in ExerciseRead


# ── Exercise ───────────────────────────────────────────────────────────────────

class ExerciseCreate(SQLModel):
    name: str
    workout_types_ids: list[int]


class ExerciseUpdate(SQLModel):
    name: str
    workout_types_ids: list[int]


class ExerciseRead(SQLModel):
    id: int
    name: str
    workout_types: list[WorkoutType]


# ── WorkoutType ────────────────────────────────────────────────────────────────

class WorkoutTypeCreate(SQLModel):
    name: str


class WorkoutTypeUpdate(SQLModel):
    name: str


# ── WorkoutSession ─────────────────────────────────────────────────────────────

class WorkoutSessionCreate(SQLModel):
    date: date
    name: Optional[str] = None
    template_id: Optional[int] = None


# ── Set ────────────────────────────────────────────────────────────────────────

class SetCreate(SQLModel):
    unit: str = "kg"
    value: Optional[float] = None
    reps: Optional[int] = None
    duration_seconds: Optional[int] = None


class SetRead(SQLModel):
    id: int
    session_exercise_id: int
    unit: str
    value: Optional[float] = None
    reps: Optional[int] = None
    duration_seconds: Optional[int] = None


class SetUpdate(SQLModel):
    reps: Optional[int] = None
    value: Optional[float] = None
    unit: Optional[str] = None
    duration_seconds: Optional[int] = None


# ── SessionExercise ────────────────────────────────────────────────────────────

class SessionExerciseRead(SQLModel):
    id: int
    workout_session_id: int
    exercise: ExerciseRead
    sets: list[SetRead]


# ── WorkoutSessionRead (nested) ────────────────────────────────────────────────

class WorkoutSessionRead(SQLModel):
    id: int
    date: date
    name: Optional[str] = None
    session_exercises: list[SessionExerciseRead]
