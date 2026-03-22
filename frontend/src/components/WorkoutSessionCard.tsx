import type { WorkoutSession } from "@/types";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

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
            </CardContent>
        </Card>
    );
}

export default WorkoutSessionCard;
