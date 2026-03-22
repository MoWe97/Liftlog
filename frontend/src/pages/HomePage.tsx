import { useEffect, useState } from "react";
import type {WorkoutSession} from "../types";
import { getWorkoutSessions } from "../api/workoutSessions";
import Navbar from "@/components/navbar.tsx";
import Sidebar from "@/components/sidebar.tsx";
import MainPanel from "@/components/MainPanel.tsx";

function HomePage() {
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    useEffect(() => {
        const dateStr = selectedDate.toLocaleDateString("en-CA");
        getWorkoutSessions(dateStr).then(setSessions);
    }, [selectedDate]);

    return (
        <div>
                <Navbar/>
            <div className="flex flex-row flex-1 pt-6">
                <Sidebar selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <div className="flex-1">
                <MainPanel selectedDate={selectedDate} sessions={sessions} />
            </div>
            <div className="w-64">right</div>
        </div>
        </div>
    );
}

export default HomePage;