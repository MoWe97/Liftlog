import type { WorkoutType} from "@/types";
import WorkoutSessionCard from "@/components/WorkoutSessionCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty.tsx";
import {Dumbbell} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useSessionStore} from "@/stores/workout-session-store.ts";
import {useEffect} from "react";
import {useWorkoutTypesStore} from "@/stores/workout-types-store.ts";

interface Props {
    selectedDate: Date;
}

function MainPanel({ selectedDate }: Props) {
    const { t, i18n } = useTranslation();
    const { sessions, addSession , fetchSessions} = useSessionStore();
    const { workout_types, fetchWorkoutTypes } = useWorkoutTypesStore();

    const onAddWorkoutSession = (workoutType: WorkoutType) => {
        const dateStr = selectedDate.toLocaleDateString("en-CA");
        addSession(dateStr, workoutType.id);
    }

    useEffect(() => {
        const dateStr = selectedDate.toLocaleDateString("en-CA");
        fetchSessions(dateStr).then();
        fetchWorkoutTypes().then();
    }, [selectedDate]);


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
                <div className="flex flex-col gap-3 px-6">
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
                                            {workout_types.map((workout_type) => (
                                                <DropdownMenuItem key={workout_type.id} onClick={() => onAddWorkoutSession(workout_type)}>{workout_type.name}</DropdownMenuItem>
                                            ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </EmptyContent>
                        </Empty>
                    ) : (
                        sessions.map(session => (
                                <WorkoutSessionCard  key={session.id} session={session} />
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default MainPanel;