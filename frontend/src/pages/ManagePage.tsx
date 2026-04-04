import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusIcon } from "lucide-react";
import { useExerciseStore } from "@/stores/exercises-store";
import { useWorkoutTypesStore } from "@/stores/workout-types-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/navbar.tsx";
import ExerciseRow from "@/components/exercise-row.tsx";
import WorkoutTypeRow from "@/components/workout-type-row.tsx";

function ManagePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { exercises, fetchExercises, createExercise, renameExercise, deleteExercise } = useExerciseStore();
    const { workoutTypes, fetchWorkoutTypes, createWorkoutType, renameWorkoutType, deleteWorkoutType } = useWorkoutTypesStore();

    const [newExerciseName, setNewExerciseName] = useState("");
    const [newWorkoutTypeName, setNewWorkoutTypeName] = useState("");

    useEffect(() => {
        fetchExercises();
        fetchWorkoutTypes();
    }, []);

    async function handleAddExercise() {
        const name = newExerciseName.trim();
        if (!name) return;
        await createExercise(name, workoutTypes.map(wt => wt.id));
        setNewExerciseName("");
    }

    async function handleAddWorkoutType() {
        const name = newWorkoutTypeName.trim();
        if (!name) return;
        await createWorkoutType(name);
        setNewWorkoutTypeName("");
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-8">

                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                    <ArrowLeft size={16} />
                    {t("manage_page.back")}
                </button>

                {/* Exercises */}
                <section className="flex flex-col gap-3">
                    <h2 className="text-lg font-semibold">{t("manage_page.exercises")}</h2>
                    <div className="flex flex-col divide-y">
                        {exercises.length === 0 && (
                            <p className="text-sm text-muted-foreground py-2">{t("manage_page.no_exercises")}</p>
                        )}
                        {exercises.map(exercise => (
                            <ExerciseRow
                                key={exercise.id}
                                exercise={exercise}
                                workoutTypes={workoutTypes}
                                onSave={renameExercise}
                                onDelete={deleteExercise}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder={t("manage_page.add_exercise_placeholder")}
                            value={newExerciseName}
                            onChange={e => setNewExerciseName(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleAddExercise(); }}
                        />
                        <Button variant="outline" size="icon" className="shrink-0" onClick={handleAddExercise}>
                            <PlusIcon size={16} />
                        </Button>
                    </div>
                </section>

                <Separator />

                {/* Workout Types */}
                <section className="flex flex-col gap-3">
                    <h2 className="text-lg font-semibold">{t("manage_page.workout_types")}</h2>
                    <div className="flex flex-col divide-y">
                        {workoutTypes.length === 0 && (
                            <p className="text-sm text-muted-foreground py-2">{t("manage_page.no_workout_types")}</p>
                        )}
                        {workoutTypes.map(wt => (
                            <WorkoutTypeRow
                                key={wt.id}
                                workoutType={wt}
                                onSave={async (id, name) => { await renameWorkoutType(id, name); fetchExercises(); }}
                                onDelete={async (id) => { await deleteWorkoutType(id); fetchExercises(); }}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder={t("manage_page.add_workout_type_placeholder")}
                            value={newWorkoutTypeName}
                            onChange={e => setNewWorkoutTypeName(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleAddWorkoutType(); }}
                        />
                        <Button variant="outline" size="icon" className="shrink-0" onClick={handleAddWorkoutType}>
                            <PlusIcon size={16} />
                        </Button>
                    </div>
                </section>

            </div>
        </div>
    );
}

export default ManagePage;
