import { create } from "zustand";
import type { WorkoutSession } from "@/types";
import {
    getWorkoutSessions,
    addWorkoutSession,
    deleteWorkoutSession,
    deleteSessionExercise,
    addExerciseToSession,
    getWorkoutSessionById,
} from "@/api/workoutSessions";

interface SessionStore {
    sessions: WorkoutSession[];
    fetchSessions: (date: string) => Promise<void>;
    addSession: (date: string, workoutTypeId: number) => Promise<void>;
    deleteSession: (id: number) => Promise<void>;
    addSessionExercise: (workout_session_id: number, exercise_id: number) => Promise<void>;
    removeSessionExercise: (sessionId: number, sessionExerciseId: number) => Promise<void>;
}

export const useSessionStore = create<SessionStore>((set) => ({
    sessions: [],

    fetchSessions: async (date) => {
        const data = await getWorkoutSessions(date);
        set({ sessions: data });
    },

    addSession: async (date, workoutTypeId) => {
        await addWorkoutSession(date, workoutTypeId);
        const data = await getWorkoutSessions(date);
        set({ sessions: data });
    },

    deleteSession: async (id) => {
        await deleteWorkoutSession(id);
        set((state) => ({ sessions: state.sessions.filter(s => s.id !== id) }));
    },

    addSessionExercise: async (workout_session_id: number, exercise_id: number) => {
        await addExerciseToSession(workout_session_id, exercise_id);
        const updatedSession = await getWorkoutSessionById(workout_session_id);
        set(state => ({
            sessions: state.sessions.map(ex =>
                ex.id === updatedSession.id ? updatedSession : ex
            )
        }))
    },

    removeSessionExercise: async (sessionId: number, sessionExerciseId: number) => {
        await deleteSessionExercise(sessionExerciseId);
        set(state => ({
            sessions: state.sessions.map(s =>
                s.id !== sessionId ? s : {
                    ...s,
                    session_exercises: s.session_exercises.filter(se => se.id !== sessionExerciseId),
                }
            ),
        }));
    },
}));
