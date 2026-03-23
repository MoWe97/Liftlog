import {  useState } from "react";
import Navbar from "@/components/navbar.tsx";
import Sidebar from "@/components/sidebar.tsx";
import MainPanel from "@/components/MainPanel.tsx";

function HomePage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());


    return (
        <>
            <div className="hidden md:flex flex-col w-full min-h-screen">
                <Navbar/>
                <div className="flex flex-row flex-1 pt-6">
                    <Sidebar selectedDate={selectedDate} onDateChange={setSelectedDate} />
                    <div className="flex-1">
                        <MainPanel selectedDate={selectedDate} />
                    </div>
                    <div className="w-64">right</div>
                </div>
            </div>

            <div className="flex md:hidden flex-col w-full min-h-screen">
                <Navbar/>
                <div className="flex flex-col flex-1 pt-6 pb-16">
                    <MainPanel selectedDate={selectedDate} />
                </div>
                {/* bottom nav goes here */}
            </div>
        </>
    );
}

export default HomePage;