from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import date
from enum import Enum


# ── Enums ────────────────────────────────────────────────────────────────────

class WorkoutTypeName(str, Enum):
    PUSH = "Push"
    PULL = "Pull"
    LEGS = "Legs"


class ResistanceUnit(str, Enum):
    KG = "kg"
    LBS = "lbs"
    BODYWEIGHT = "bodyweight"


# ── Link table (many-to-many: Exercise ↔ WorkoutType) ────────────────────────

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
    name: WorkoutTypeName

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

class ExerciseCreate(SQLModel):
    name: str
    workout_types_ids: list[int]

class ExerciseRead(SQLModel):
    id: int
    name: str
    workout_types: list[WorkoutType]


class WorkoutSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: date
    workout_type_id: Optional[int] = Field(default=None, foreign_key="workouttype.id")

    workout_type: Optional[WorkoutType] = Relationship(back_populates="workout_sessions")
    session_exercises: list["SessionExercise"] = Relationship(back_populates="workout_session")


class WorkoutSessionCreate(SQLModel):
    date: date
    workout_type_id: int


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

class SetRead(SQLModel):
    id: int
    session_exercise_id: int
    unit: ResistanceUnit
    value: Optional[float] = None
    reps: Optional[int] = None
    duration_seconds: Optional[int] = None

class SetCreate(SQLModel):
    session_exercise_id: int
    unit: ResistanceUnit
    value: Optional[float] = None
    reps: Optional[int] = None
    duration_seconds: Optional[int] = None

class SessionExerciseRead(SQLModel):
    id: int
    workout_session_id: int
    exercise: ExerciseRead
    sets: list["SetRead"]

class WorkoutSessionRead(SQLModel):
    id: int
    date: date
    workout_type_id: Optional[int]
    workout_type: Optional[WorkoutType] = None
    session_exercises: list[SessionExerciseRead]

class SetUpdate(SQLModel):
    reps: int | None = None
    value: float | None = None
    unit: str | None = None
    duration_seconds: int | None = None