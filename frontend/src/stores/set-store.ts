import { create } from "zustand";
import type { ExerciseSet } from "@/types";
import {
    addSetToSessionExercise,
    deleteSet,
    changeReps,
    getWorkoutSessionById,
} from "@/api/workoutSessions";
import { useSessionStore } from "@/stores/workout-session-store";

async function refreshSession(workout_session_id: number) {
    const updated = await getWorkoutSessionById(workout_session_id);
    useSessionStore.setState((state) => ({
        sessions: state.sessions.map((s) =>
            s.id === updated.id ? updated : s
        ),
    }));
}

interface SetStore {
    addSet: (workout_session_id: number, session_exercise_id: number, sets: Partial<ExerciseSet>[]) => Promise<void>;
    changeReps: (workout_session_id: number, set_id: number, reps: number) => Promise<void>;
    deleteSet: (workout_session_id: number, set_id: number) => Promise<void>;
}

export const useSetStore = create<SetStore>(() => ({
    addSet: async (workout_session_id, session_exercise_id, sets) => {
        await addSetToSessionExercise(session_exercise_id, sets);
        await refreshSession(workout_session_id);
    },

    changeReps: async (workout_session_id, set_id, reps) => {
        await changeReps(set_id, reps);
        await refreshSession(workout_session_id);
    },

    deleteSet: async (workout_session_id, set_id) => {
        await deleteSet(set_id);
        await refreshSession(workout_session_id);
    },
}));
