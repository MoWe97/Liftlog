from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import date


class ExerciseWorkoutTypeLink(SQLModel, table=True):
    exercise_id: Optional[int] = Field(
        default=None, foreign_key="exercise.id", primary_key=True, ondelete="CASCADE"
    )
    workout_type_id: Optional[int] = Field(
        default=None, foreign_key="workouttype.id", primary_key=True, ondelete="CASCADE"
    )


class WorkoutType(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    user_id: Optional[str] = None

    exercises: list["Exercise"] = Relationship(
        back_populates="workout_types", link_model=ExerciseWorkoutTypeLink
    )


class Exercise(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    user_id: Optional[str] = None

    workout_types: list[WorkoutType] = Relationship(
        back_populates="exercises", link_model=ExerciseWorkoutTypeLink
    )
    session_exercises: list["SessionExercise"] = Relationship(back_populates="exercise")


class WorkoutSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: date
    name: Optional[str] = None
    user_id: Optional[str] = None

    session_exercises: list["SessionExercise"] = Relationship(back_populates="workout_session", sa_relationship_kwargs={"passive_deletes": True})


class SessionExercise(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    workout_session_id: Optional[int] = Field(default=None, foreign_key="workoutsession.id", ondelete="CASCADE")
    exercise_id: Optional[int] = Field(default=None, foreign_key="exercise.id", ondelete="CASCADE")

    workout_session: Optional[WorkoutSession] = Relationship(back_populates="session_exercises")
    exercise: Optional[Exercise] = Relationship(back_populates="session_exercises")
    sets: list["Set"] = Relationship(back_populates="session_exercise", sa_relationship_kwargs={"order_by": "Set.id", "passive_deletes": True})


class Set(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_exercise_id: Optional[int] = Field(default=None, foreign_key="sessionexercise.id", ondelete="CASCADE")

    unit: str
    value: Optional[float] = None
    reps: Optional[int] = None
    duration_seconds: Optional[int] = None

    session_exercise: Optional[SessionExercise] = Relationship(back_populates="sets")
