import type {WorkoutSession, WorkoutType} from "@/types";
import WorkoutSessionCard from "@/components/WorkoutSessionCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty.tsx";
import {Dumbbell} from "lucide-react";
import {addWorkoutSession} from "@/api/workoutSessions.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";

interface Props {
    selectedDate: Date;
    sessions: WorkoutSession[];
    workoutTypes: WorkoutType[];
    onSessionAdded: () => void;
}

function MainPanel({ selectedDate, sessions, workoutTypes, onSessionAdded }: Props) {
    const { t, i18n } = useTranslation();
    const onAddWorkoutSession = (workoutType: WorkoutType) => {
        const dateStr = selectedDate.toLocaleDateString("en-CA");
        addWorkoutSession(dateStr, workoutType.id).then(onSessionAdded);
    }

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:flex flex-1 p-6 flex-col gap-4">
                <h2 className="text-2xl font-bold tracking-tight text-center">
                    {selectedDate.toLocaleDateString(i18n.language, { weekday: "long", month: "long", day: "numeric" })}
                </h2>
                <div className="flex flex-col gap-3">
                    {sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                            <span className="text-4xl">🏋️</span>
                            <span className="text-sm">No sessions recorded</span>
                        </div>
                    ) : (
                        sessions.map(session => (
                            <WorkoutSessionCard key={session.id} session={session} />
                        ))
                    )}
                </div>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden flex-1 p-2 flex-col gap-4">
                <h3 className="text-xl font-bold tracking-tight text-center">
                    {selectedDate.toLocaleDateString(i18n.language, { month: "long", day: "numeric", year: "numeric" })}
                </h3>
                <div className="flex flex-col gap-3">
                    {sessions.length === 0 ? (
                        <Empty className="bg-muted/30">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <Dumbbell />
                                </EmptyMedia>
                                <EmptyTitle>{t("main_panel.no_workout_session1")}</EmptyTitle>
                                <EmptyDescription>{t("main_panel.no_workout_session2")}</EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button>{t("main_panel.new_session_button")}</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            {workoutTypes.map((workoutType) => (
                                                <DropdownMenuItem key={workoutType.id} onClick={() => onAddWorkoutSession(workoutType)}>{workoutType.name}</DropdownMenuItem>
                                            ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </EmptyContent>
                        </Empty>
                    ) : (
                        sessions.map(session => (
                            <WorkoutSessionCard key={session.id} session={session} />
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default MainPanel;