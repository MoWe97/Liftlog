import {useEffect, useState} from 'react'
import './App.css'
import {getWorkoutSessions} from "@/api/workoutSessions.ts";
import HomePage from "@/pages/HomePage.tsx";
import type {WorkoutSession} from "@/types";
import {ThemeProvider} from "@/components/theme-provider.tsx";

function App() {
  const [count, setCount] = useState(0)

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    getWorkoutSessions().then(setSessions);
  }, []);

  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <HomePage></HomePage>
      </ThemeProvider>
  );
}

export default App
