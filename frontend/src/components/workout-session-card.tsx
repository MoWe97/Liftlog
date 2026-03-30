import type { Exercise, WorkoutSession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button.tsx";
import { useSessionStore } from "@/stores/workout-session-store.ts";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { Dumbbell, PlusIcon, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useTranslation } from "react-i18next";
import SessionExerciseCard from "@/components/session-exercise-card.tsx";

interface Props {
    session: WorkoutSession;
    exercises: Exercise[];
}

function WorkoutSessionCard({ session, exercises }: Props) {
    const { deleteSession, addSessionExercise } = useSessionStore();
    const { t } = useTranslation();

    const sessionExercises = exercises.filter(
        e => e.workout_types.some(({ id }) => id === session.workout_type_id)
    );

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{session.workout_type?.name}</CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteSession(session.id)}
                >
                    <Trash2 size={16} />
                </Button>
            </CardHeader>
            <CardContent>
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button>{t("workout_session_card.add_exercise")}</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {sessionExercises.map((exercise) => (
                                        <DropdownMenuItem key={exercise.id} onClick={() => addSessionExercise(session.id, exercise.id)}>
                                            {exercise.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </EmptyContent>
                    </Empty>
                ) : (
                    session.session_exercises.map((sessionExercise) => (
                        <SessionExerciseCard key={sessionExercise.id} sessionExercise={sessionExercise} />
                    ))
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="default" size="icon" className="p-2">
                            <PlusIcon size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Add Exercise</DropdownMenuLabel>
                        {sessionExercises.map((exercise) => (
                            <DropdownMenuItem key={exercise.id} onClick={() => addSessionExercise(session.id, exercise.id)}>
                                {exercise.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardContent>
        </Card>
    );
}

export default WorkoutSessionCard;
