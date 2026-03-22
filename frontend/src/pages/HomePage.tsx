import { useEffect, useState } from "react";
import type {WorkoutSession} from "../types";
import { getWorkoutSessions } from "../api/workoutSessions";
import WorkoutSessionCard from "../components/WorkoutSessionCard";

function HomePage() {
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);

    useEffect(() => {
        getWorkoutSessions().then(setSessions);
    }, []);

    return (
        <div className="flex flex-row h-screen w-full">
            <div className="w-64">left</div>
            <div className="flex-1">
                     {sessions.map(session => (
                         <WorkoutSessionCard key={session.id} session={session} />
                     ))}
            </div>
            <div className="w-64">right</div>
        </div>
    );
}

export default HomePage;