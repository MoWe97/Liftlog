import type {WorkoutSession} from "@/types";
import WorkoutSessionCard from "@/components/WorkoutSessionCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {AddIcon} from "@hugeicons/core-free-icons";

interface Props {
    selectedDate: Date;
    sessions: WorkoutSession[];
}

function MainPanel({ selectedDate, sessions }: Props) {




    return (
        <div className="flex-1 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2>{ /* format selectedDate nicely here */ }</h2>
            </div>
            <div className="flex flex-col gap-3">
                {sessions.map(session => (
                    <WorkoutSessionCard key={session.id} session={session} />
                ))}
            </div>
            <Button variant="ghost">
                <HugeiconsIcon icon={AddIcon}/>
            </Button>
        </div>
    );
}

export default MainPanel;