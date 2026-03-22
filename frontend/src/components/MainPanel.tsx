import type {WorkoutSession} from "@/types";
import WorkoutSessionCard from "@/components/WorkoutSessionCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {AddIcon} from "@hugeicons/core-free-icons";
import {useTranslation} from "react-i18next";

interface Props {
    selectedDate: Date;
    sessions: WorkoutSession[];
}

function MainPanel({ selectedDate, sessions }: Props) {
    const { i18n } = useTranslation();



    return (
        <div className="flex-1 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col px-5">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                        {selectedDate.toLocaleDateString(i18n.language, { weekday: "long" })}
                    </span>
                    <span className="text-2xl font-bold tracking-tight">
                        {selectedDate.toLocaleDateString(i18n.language, { month: "long", day: "numeric" })}
                    </span>
                </div>
                <Button variant="ghost">
                    <HugeiconsIcon icon={AddIcon}/>
                </Button>
            </div>
            <div className="flex flex-col gap-3">
                {sessions.map(session => (
                    <WorkoutSessionCard key={session.id} session={session} />
                ))}
            </div>
        </div>
    );
}

export default MainPanel;