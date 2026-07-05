import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const sections: { title: string; body: string }[] = [
    {
        title: "1. Information We Collect",
        body: "When you sign in with Google (via Clerk), we receive your name, email address, and Google account ID. When you use LiftLog, we store the workout data you create: workout sessions, exercises, workout types, and sets (weight and reps).",
    },
    {
        title: "2. How We Use Your Information",
        body: "We use this information solely to provide the Service to you: authenticating your account and storing and displaying your own workout data back to you. We do not sell your data or use it for advertising.",
    },
    {
        title: "3. Third-Party Services",
        body: "LiftLog relies on third-party providers to operate: Clerk for authentication, and Fly.io for application hosting and database storage. These providers process data on our behalf under their own privacy and security practices.",
    },
    {
        title: "4. Data Storage and Security",
        body: "Your data is stored in a PostgreSQL database hosted on Fly.io. We take reasonable measures to protect it, but no method of electronic storage is completely secure, and we cannot guarantee absolute security.",
    },
    {
        title: "5. Local Storage",
        body: "LiftLog stores your theme and language preference in your browser's local storage. This information stays on your device and is not sent to our servers.",
    },
    {
        title: "6. Your Rights",
        body: "You can access and edit your workout data at any time within the app. You may request deletion of your account and all associated data by contacting us at the address below.",
    },
    {
        title: "7. Children's Privacy",
        body: "LiftLog is not directed at children under 16, and we do not knowingly collect information from them.",
    },
    {
        title: "8. Changes to This Policy",
        body: "We may update this Privacy Policy from time to time. Continued use of the Service after changes take effect constitutes acceptance of the updated policy.",
    },
    {
        title: "9. Contact",
        body: "Questions about this Privacy Policy? Contact us at emdobbleu@gmail.com.",
    },
];

function PrivacyPolicyPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                    <ArrowLeft size={16} />
                    Back to home
                </button>

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="text-sm text-muted-foreground">Last updated: July 5, 2026</p>
                    <p className="text-sm text-muted-foreground pt-2">
                        This Privacy Policy explains what information LiftLog collects, how it is used, and your
                        rights regarding that information.
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    {sections.map(({ title, body }) => (
                        <section key={title} className="flex flex-col gap-1.5">
                            <h2 className="text-base font-semibold">{title}</h2>
                            <p className="text-sm text-muted-foreground">{body}</p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicyPage;
