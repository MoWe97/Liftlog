import { create } from "zustand";
import type { Exercise } from "@/types";
import { createExercise, updateExercise, deleteExercise, getExercises } from "@/api/exercises.ts";

interface ExerciseStore {
    exercises: Exercise[];
    fetchExercises: () => Promise<void>;
    createExercise: (name: string, workoutTypeIds: number[]) => Promise<Exercise>;
    renameExercise: (id: number, name: string, workoutTypeIds: number[]) => Promise<void>;
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

    renameExercise: async (id: number, name: string, workoutTypeIds: number[]) => {
        const updated = await updateExercise(id, name, workoutTypeIds);
        set(state => ({
            exercises: state.exercises.map(e => e.id === id ? updated : e),
        }));
    },

    deleteExercise: async (id) => {
        await deleteExercise(id);
        set(state => ({ exercises: state.exercises.filter(e => e.id !== id) }));
    },
}));
