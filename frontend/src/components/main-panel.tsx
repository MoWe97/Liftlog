import WorkoutSessionCard from "@/components/workout-session-card.tsx";
import { useTranslation } from "react-i18next";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { Dumbbell } from "lucide-react";
import { useSessionStore } from "@/stores/workout-session-store.ts";
import { useEffect } from "react";
import { useWorkoutTypesStore } from "@/stores/workout-types-store.ts";
import { useExerciseStore } from "@/stores/exercises-store.ts";
import StartSessionDialog from "@/components/start-session-dialog.tsx";
import DateNavigator from "@/components/date-navigator.tsx";

interface Props {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

function MainPanel({ selectedDate, onDateChange }: Props) {
    const { t } = useTranslation();
    const { sessions, addSession, fetchSessions } = useSessionStore();
    const { workoutTypes, fetchWorkoutTypes } = useWorkoutTypesStore();
    const { exercises, fetchExercises } = useExerciseStore();

    useEffect(() => {
        const dateStr = selectedDate.toLocaleDateString("en-CA");
        fetchSessions(dateStr).then();
        fetchExercises().then();
        fetchWorkoutTypes().then();
    }, [selectedDate]);

    const dateStr = selectedDate.toLocaleDateString("en-CA");

    function handleStart(name?: string, templateId?: number) {
        addSession(dateStr, name, templateId);
    }

    const dialog = (
        <StartSessionDialog
            workoutTypes={workoutTypes}
            onStart={handleStart}
        />
    );

    return (
        <>
            {/* Desktop */}
            <div className="hidden md:flex flex-1 p-6 flex-col gap-4">
                <DateNavigator selectedDate={selectedDate} onDateChange={onDateChange} />
                <div className="flex flex-col gap-3">
                    {sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-4">
                            <span className="text-4xl">🏋️</span>
                            <span className="text-sm">{t("main_panel.no_sessions_recorded")}</span>
                            {dialog}
                        </div>
                    ) : (
                        <>
                            {sessions.map(session => (
                                <WorkoutSessionCard key={session.id} session={session} exercises={exercises} />
                            ))}
                            {dialog}
                        </>
                    )}
                </div>
            </div>

            {/* Mobile */}
            <div className="flex md:hidden flex-1 p-2 flex-col gap-4">
                <DateNavigator selectedDate={selectedDate} onDateChange={onDateChange} />
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
                            <EmptyContent>{dialog}</EmptyContent>
                        </Empty>
                    ) : (
                        <>
                            {sessions.map(session => (
                                <WorkoutSessionCard key={session.id} session={session} exercises={exercises} />
                            ))}
                            {dialog}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default MainPanel;
