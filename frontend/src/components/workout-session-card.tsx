import type { Exercise, WorkoutSession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button.tsx";
import { useSessionStore } from "@/stores/workout-session-store.ts";
import { useExerciseStore } from "@/stores/exercises-store.ts";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { Dumbbell, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import SessionExerciseCard from "@/components/session-exercise-card.tsx";
import AddExerciseDialog from "@/components/add-exercise-dialog.tsx";
import { useRef, useState } from "react";

interface Props {
    session: WorkoutSession;
    exercises: Exercise[];
}

function WorkoutSessionCard({ session, exercises }: Props) {
    const { deleteSession, addSessionExercise, removeSessionExercise } = useSessionStore();
    const { createExercise } = useExerciseStore();
    const { t } = useTranslation();
    const [pendingDelete, setPendingDelete] = useState(false);
    const pendingDeleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const sessionExercises = exercises.filter(
        e => e.workout_types.some(({ id }) => id === session.workout_type_id)
    );

    function handleDeleteClick() {
        if (pendingDelete) {
            if (pendingDeleteTimer.current) clearTimeout(pendingDeleteTimer.current);
            deleteSession(session.id);
        } else {
            setPendingDelete(true);
            pendingDeleteTimer.current = setTimeout(() => setPendingDelete(false), 2000);
        }
    }

    async function handleCreateAndSelect(name: string) {
        const exercise = await createExercise(name, session.workout_type_id ? [session.workout_type_id] : []);
        await addSessionExercise(session.id, exercise.id);
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{session.workout_type?.name}</CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className={pendingDelete
                        ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                        : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    }
                    onClick={handleDeleteClick}
                >
                    <Trash2 size={16} />
                </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {session.session_exercises.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Dumbbell />
                            </EmptyMedia>
                            <EmptyTitle>{t("workout_session_card.no_exercises")}</EmptyTitle>
                        </EmptyHeader>
                        <EmptyContent className="flex-row justify-center gap-2">
                            <Button variant="secondary">{t("workout_session_card.copy_from_last_session")}</Button>
                            <AddExerciseDialog
                                exercises={sessionExercises}
                                onSelect={(id) => addSessionExercise(session.id, id)}
                                onCreateAndSelect={handleCreateAndSelect}
                            />
                        </EmptyContent>
                    </Empty>
                ) : (
                    <>
                        {session.session_exercises.map((sessionExercise) => (
                            <SessionExerciseCard
                                key={sessionExercise.id}
                                sessionExercise={sessionExercise}
                                onDelete={() => removeSessionExercise(session.id, sessionExercise.id)}
                            />
                        ))}
                        <AddExerciseDialog
                            exercises={sessionExercises}
                            onSelect={(id) => addSessionExercise(session.id, id)}
                            onCreateAndSelect={handleCreateAndSelect}
                        />
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default WorkoutSessionCard;
