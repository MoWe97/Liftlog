import client from "./client";
import type { ExerciseSet, SessionExercise, WorkoutSession } from "../types";

export const getWorkoutSessions = async (date?: string): Promise<WorkoutSession[]> => {
    const params = date ? { date } : {};
    const response = await client.get("/workout-sessions", { params });
    return response.data;
};

export const getWorkoutSessionById = async (workout_session_id: number): Promise<WorkoutSession> => {
    const response = await client.get(`/workout-sessions/${workout_session_id}`);
    return response.data;
};

export const addWorkoutSession = async (date: string, name?: string, template_id?: number): Promise<WorkoutSession> => {
    const response = await client.post("/workout-sessions", { date, name, template_id });
    return response.data;
};

export const addExerciseToSession = async (
    workout_session_id: number,
    exercise_id: number
): Promise<SessionExercise> => {
    const response = await client.post(
        `/workout-sessions/${workout_session_id}/exercises?exercise_id=${exercise_id}`
    );
    return response.data;
};

export const addSetToSessionExercise = async (session_exercise_id: number, exerciseSets: Partial<ExerciseSet[]>): Promise<ExerciseSet[]> => {
    const response = await client.post(`/session-exercise/${session_exercise_id}/sets`, exerciseSets);
    return response.data;
};

export const patchSet = async (set_id: number, patch: Partial<Pick<ExerciseSet, 'reps' | 'value' | 'unit'>>): Promise<void> => {
    await client.patch(`/sets/${set_id}`, patch);
};

export const deleteSet = async (set_id: number): Promise<void> => {
    await client.delete(`/sets/${set_id}`);
};

export const deleteWorkoutSession = async (id: number): Promise<void> => {
    await client.delete(`/workout-sessions/${id}`);
};

export const deleteSessionExercise = async (sessionExerciseId: number): Promise<void> => {
    await client.delete(`/session-exercises/${sessionExerciseId}`);
};
