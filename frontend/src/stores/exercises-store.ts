import { create } from "zustand";
import type { Exercise } from "@/types";
import { createExercise, deleteExercise, getExercises } from "@/api/exercises.ts";

interface ExerciseStore {
    exercises: Exercise[];
    fetchExercises: () => Promise<void>;
    createExercise: (name: string, workoutTypeIds: number[]) => Promise<Exercise>;
    deleteExercise: (id: number) => Promise<void>;
}

export const useExerciseStore = create<ExerciseStore>((set) => ({
    exercises: [],

    fetchExercises: async () => {
        const data = await getExercises();
        set({ exercises: data });
    },

    createExercise: async (name: string, workoutTypeIds: number[]) => {
        const exercise = await createExercise(name, workoutTypeIds);
        set(state => ({ exercises: [...state.exercises, exercise] }));
        return exercise;
    },

    deleteExercise: async (id) => {
        await deleteExercise(id);
        set((state) => ({ exercises: state.exercises.filter(s => s.id !== id) }));
    },
}));
