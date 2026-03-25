import { create } from "zustand";
import type {Exercise} from "@/types";
import {addExercise, deleteExercise, getExercises} from "@/api/exercises.ts";

interface ExerciseStore {
    exercises: Exercise[];
    fetchExercises: () => Promise<void>;
    addExercise: (workout_type_id: number) => Promise<void>;
    deleteExercise: (id: number) => Promise<void>;
}

export const useExerciseStore = create<ExerciseStore>((set) => ({
    exercises: [],

    fetchExercises: async () => {
        const data = await getExercises();
        set({ exercises: data });
    },

    addExercise: async ( workout_type_id: number) => {
        await addExercise(workout_type_id);
        const data = await getExercises();
        set({ exercises: data });
    },

    deleteExercise: async (id) => {
        await deleteExercise(id);
        set((state) => ({ exercises: state.exercises.filter(s => s.id !== id) }));
    },
}));
