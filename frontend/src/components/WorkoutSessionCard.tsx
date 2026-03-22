import type { WorkoutSession } from "@/types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Switch} from "@/components/ui/switch.tsx";

interface Props {
    session: WorkoutSession;
}

function WorkoutSessionCard({ session }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{session.date}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Workout Type: {session.workout_type_id}</p>
                <Switch></Switch>
            </CardContent>
        </Card>
    );
}

export default WorkoutSessionCard;
