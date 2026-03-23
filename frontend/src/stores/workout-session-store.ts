import { create } from "zustand";
import type { WorkoutSession } from "@/types";
import { getWorkoutSessions, addWorkoutSession, deleteWorkoutSession } from "@/api/workoutSessions";

interface SessionStore {
    sessions: WorkoutSession[];
    fetchSessions: (date: string) => Promise<void>;
    addSession: (date: string, workoutTypeId: number) => Promise<void>;
    deleteSession: (id: number) => Promise<void>;
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
}));
