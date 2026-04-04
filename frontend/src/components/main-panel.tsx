import type { WorkoutType } from "@/types";
import WorkoutSessionCard from "@/components/workout-session-card.tsx";
import { useTranslation } from "react-i18next";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { Dumbbell } from "lucide-react";
import { useSessionStore } from "@/stores/workout-session-store.ts";
import { useEffect } from "react";
import { useWorkoutTypesStore } from "@/stores/workout-types-store.ts";
import { useExerciseStore } from "@/stores/exercises-store.ts";
import StartSessionDialog from "@/components/start-session-dialog.tsx";

interface Props {
    selectedDate: Date;
}

function MainPanel({ selectedDate }: Props) {
    const { t, i18n } = useTranslation();
    const { sessions, addSession, fetchSessions } = useSessionStore();
    const { workoutTypes, fetchWorkoutTypes, createWorkoutType } = useWorkoutTypesStore();
    const { exercises, fetchExercises } = useExerciseStore();

    useEffect(() => {
        const dateStr = selectedDate.toLocaleDateString("en-CA");
        fetchSessions(dateStr).then();
        fetchExercises().then();
        fetchWorkoutTypes().then();
    }, [selectedDate]);

    const dateStr = selectedDate.toLocaleDateString("en-CA");

    async function handleCreateAndSelect(name: string) {
        const workoutType = await createWorkoutType(name);
        await addSession(dateStr, workoutType.id);
    }

    function handleSelect(workoutType: WorkoutType) {
        addSession(dateStr, workoutType.id);
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
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-4">
                            <span className="text-4xl">🏋️</span>
                            <span className="text-sm">{t("main_panel.no_sessions_recorded")}</span>
                            <StartSessionDialog
                                workoutTypes={workoutTypes}
                                onSelect={handleSelect}
                                onCreateAndSelect={handleCreateAndSelect}
                            />
                        </div>
                    ) : (
                        <>
                            {sessions.map(session => (
                                <WorkoutSessionCard key={session.id} session={session} exercises={exercises} />
                            ))}
                            <StartSessionDialog
                                workoutTypes={workoutTypes}
                                onSelect={handleSelect}
                                onCreateAndSelect={handleCreateAndSelect}
                            />
                        </>
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
                                <StartSessionDialog
                                    workoutTypes={workoutTypes}
                                    onSelect={handleSelect}
                                    onCreateAndSelect={handleCreateAndSelect}
                                />
                            </EmptyContent>
                        </Empty>
                    ) : (
                        <>
                            {sessions.map(session => (
                                <WorkoutSessionCard key={session.id} session={session} exercises={exercises} />
                            ))}
                            <StartSessionDialog
                                workoutTypes={workoutTypes}
                                onSelect={handleSelect}
                                onCreateAndSelect={handleCreateAndSelect}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default MainPanel;
