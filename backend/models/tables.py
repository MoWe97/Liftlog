from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import date
from enum import Enum


# ── Enums ─────────────────────────────────────────────────────────────────────

class WorkoutTypeName(str, Enum):
    PUSH = "Push"
    PULL = "Pull"
    LEGS = "Legs"


class ResistanceUnit(str, Enum):
    KG = "kg"
    LBS = "lbs"
    BODYWEIGHT = "bodyweight"


# ── Link table (many-to-many: Exercise ↔ WorkoutType) ─────────────────────────

class ExerciseWorkoutTypeLink(SQLModel, table=True):
    exercise_id: Optional[int] = Field(
        default=None, foreign_key="exercise.id", primary_key=True
    )
    workout_type_id: Optional[int] = Field(
        default=None, foreign_key="workouttype.id", primary_key=True
    )


# ── Core tables ───────────────────────────────────────────────────────────────

class WorkoutType(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    workout_sessions: list["WorkoutSession"] = Relationship(back_populates="workout_type")
    exercises: list["Exercise"] = Relationship(
        back_populates="workout_types", link_model=ExerciseWorkoutTypeLink
    )


class Exercise(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    workout_types: list[WorkoutType] = Relationship(
        back_populates="exercises", link_model=ExerciseWorkoutTypeLink
    )
    session_exercises: list["SessionExercise"] = Relationship(back_populates="exercise")


class WorkoutSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: date
    workout_type_id: Optional[int] = Field(default=None, foreign_key="workouttype.id")

    workout_type: Optional[WorkoutType] = Relationship(back_populates="workout_sessions")
    session_exercises: list["SessionExercise"] = Relationship(back_populates="workout_session")


class SessionExercise(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    workout_session_id: Optional[int] = Field(default=None, foreign_key="workoutsession.id")
    exercise_id: Optional[int] = Field(default=None, foreign_key="exercise.id")

    workout_session: Optional[WorkoutSession] = Relationship(back_populates="session_exercises")
    exercise: Optional[Exercise] = Relationship(back_populates="session_exercises")
    sets: list["Set"] = Relationship(back_populates="session_exercise")


class Set(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_exercise_id: Optional[int] = Field(default=None, foreign_key="sessionexercise.id")

    unit: ResistanceUnit
    value: Optional[float] = None
    reps: Optional[int] = None
    duration_seconds: Optional[int] = None

    session_exercise: Optional[SessionExercise] = Relationship(back_populates="sets")
