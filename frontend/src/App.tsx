import {useEffect, useState} from 'react'
import './App.css'
import type {WorkoutSession} from "./types";
import {getWorkoutSessions} from "./api/workoutSessions.ts";
import HomePage from "./pages/HomePage.tsx";

function App() {
  const [count, setCount] = useState(0)

  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    getWorkoutSessions().then(setSessions);
  }, []);

  return (
      <HomePage></HomePage>
  );
}

export default App
