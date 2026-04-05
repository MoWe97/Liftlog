import { create } from "zustand";
import type { ExerciseSet } from "@/types";
import {
    addSetToSessionExercise,
    deleteSet,
    patchSet,
} from "@/api/workoutSessions";
import { useSessionStore } from "@/stores/workout-session-store";

interface SetStore {
    addSet: (workout_session_id: number, session_exercise_id: number, sets: ExerciseSet[]) => Promise<ExerciseSet[]>;
    addSetLocally: (workout_session_id: number, session_exercise_id: number, sets: ExerciseSet[]) => void;
    patchSet: (workout_session_id: number, set_id: number, patch: Partial<Pick<ExerciseSet, 'reps' | 'value' | 'unit'>>) => Promise<void>;
    patchSetLocally: (workout_session_id: number, set_id: number, patch: Partial<Pick<ExerciseSet, 'reps' | 'value' | 'unit'>>) => void;
    deleteSet: (workout_session_id: number, set_id: number) => Promise<void>;
}

export const useSetStore = create<SetStore>((_,get) => ({
    addSet: async (workout_session_id, session_exercise_id, sets) => {
        get().addSetLocally(workout_session_id, session_exercise_id, sets);
        const created = await addSetToSessionExercise(session_exercise_id, sets);
        useSessionStore.setState((state) => ({
            sessions: state.sessions.map((s) =>
                s.id !== workout_session_id ? s : {
                    ...s,
                    session_exercises: s.session_exercises.map((se) =>
                        se.id !== session_exercise_id ? se : {
                            ...se,
                            sets: [...se.sets.filter(set => set.id >= 0), ...created],
                        }
                    ),
                }
            ),
        }));
        return created;
    },

    addSetLocally: (workout_session_id, session_exercise_id, newSets) => {
        useSessionStore.setState((state) => ({
            sessions: state.sessions.map((s) =>
                s.id !== workout_session_id ? s : {
                    ...s,
                    session_exercises: s.session_exercises.map((se) =>
                        se.id !== session_exercise_id ? se : {
                            ...se,
                            sets: [...se.sets, ...newSets],
                        }
                    ),
                }
            ),
        }));
    },

    patchSet: async (workout_session_id, set_id, patch) => {
        await patchSet(set_id, patch);
        get().patchSetLocally(workout_session_id, set_id, patch);
    },

    patchSetLocally: (workout_session_id, set_id, patch) => {
        useSessionStore.setState((state) => ({
            sessions: state.sessions.map((s) =>
                s.id !== workout_session_id ? s : {
                    ...s,
                    session_exercises: s.session_exercises.map((se) => ({
                        ...se,
                        sets: se.sets.map((set) =>
                            set.id !== set_id ? set : { ...set, ...patch }
                        ),
                    })),
                }
            ),
        }));
    },

    deleteSet: async (workout_session_id, set_id) => {
        useSessionStore.setState((state) => ({
            sessions: state.sessions.map((s) =>
                s.id !== workout_session_id ? s : {
                    ...s,
                    session_exercises: s.session_exercises.map((se) => ({
                        ...se,
                        sets: se.sets.filter((set) => set.id !== set_id),
                    })),
                }
            ),
        }));
        await deleteSet(set_id);
    },
}));
