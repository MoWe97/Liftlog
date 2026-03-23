import type { WorkoutSession } from "@/types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button.tsx";
import {useSessionStore} from "@/stores/workout-session-store.ts";

interface Props {
    session: WorkoutSession;
}

function WorkoutSessionCard({ session }: Props) {
    const { deleteSession } = useSessionStore();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{session.date}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Workout Type: {session.workout_type_id}</p>
                <Button variant="ghost" onClick={() => deleteSession(session.id)}>
                    Delete
                </Button>
            </CardContent>
        </Card>
    );
}

export default WorkoutSessionCard;
