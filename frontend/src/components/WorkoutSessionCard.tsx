import type { WorkoutSession } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button.tsx";
import { useSessionStore } from "@/stores/workout-session-store.ts";
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { Dumbbell, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx";
import { useTranslation } from "react-i18next";

interface Props {
    session: WorkoutSession;
}

function WorkoutSessionCard({ session }: Props) {
    const { deleteSession } = useSessionStore();
    const { t } = useTranslation();

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
                                    <DropdownMenuLabel>Add Exercise</DropdownMenuLabel>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </EmptyContent>
                    </Empty>
                ) : <></>}
            </CardContent>
        </Card>
    );
}

export default WorkoutSessionCard;
