import { useEffect, useState } from "react";
import type {WorkoutSession} from "../types";
import { getWorkoutSessions } from "../api/workoutSessions";
import WorkoutSessionCard from "../components/WorkoutSessionCard";
import Navbar from "@/components/navbar.tsx";
import Sidebar from "@/components/sidebar.tsx";

function HomePage() {
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    function dateChange(date: Date) {
        console.log(date);
        setSelectedDate(date);
    }

    useEffect(() => {
        const dateStr = selectedDate.toLocaleDateString("en-CA");
        getWorkoutSessions(dateStr).then(setSessions);
    }, [selectedDate]);

    return (
        <div>
                <Navbar/>
            <div className="flex flex-row flex-1 pt-6">
                <Sidebar selectedDate={selectedDate} onDateChange={dateChange} />
            <div className="flex-1">
                     {sessions.map(session => (
                         <WorkoutSessionCard key={session.id} session={session} />
                     ))}
            </div>
            <div className="w-64">right</div>
        </div>
        </div>
    );
}

export default HomePage;