import { useEffect, useState } from "react";
import type {WorkoutSession, WorkoutType} from "../types";
import { getWorkoutSessions } from "../api/workoutSessions";
import Navbar from "@/components/navbar.tsx";
import Sidebar from "@/components/sidebar.tsx";
import MainPanel from "@/components/MainPanel.tsx";
import {getWorkoutTypes} from "@/api/workoutTypes.ts";

function HomePage() {
    const [sessions, setSessions] = useState<WorkoutSession[]>([]);
    const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const onSessionAdded = () => {
        const dateStr = selectedDate.toLocaleDateString("en-CA");
        getWorkoutSessions(dateStr).then(setSessions);
    }

    useEffect(() => {
        const dateStr = selectedDate.toLocaleDateString("en-CA");
        getWorkoutSessions(dateStr).then(setSessions);
        getWorkoutTypes().then(setWorkoutTypes);
    }, [selectedDate]);

    return (
        <>
            <div className="hidden md:flex flex-col w-full min-h-screen">
                <Navbar/>
                <div className="flex flex-row flex-1 pt-6">
                    <Sidebar selectedDate={selectedDate} onDateChange={setSelectedDate} />
                    <div className="flex-1">
                        <MainPanel selectedDate={selectedDate} sessions={sessions} workoutTypes={workoutTypes} onSessionAdded={onSessionAdded}/>
                    </div>
                    <div className="w-64">right</div>
                </div>
            </div>

            <div className="flex md:hidden flex-col w-full min-h-screen">
                <Navbar/>
                <div className="flex flex-col flex-1 pt-6 pb-16">
                    <MainPanel selectedDate={selectedDate} sessions={sessions} workoutTypes={workoutTypes} onSessionAdded={onSessionAdded} />
                </div>
                {/* bottom nav goes here */}
            </div>
        </>
    );
}

export default HomePage;