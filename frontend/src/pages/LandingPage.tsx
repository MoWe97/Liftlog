import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Dumbbell, TrendingUp } from "lucide-react";
import { GithubLogoIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { SignInButton, useAuth } from "@clerk/react";

const features = [
    {
        icon: CalendarDays,
        title: "Log by date",
        description: "Every workout tied to a date. Navigate your history at a glance.",
    },
    {
        icon: Dumbbell,
        title: "Track exercises",
        description: "Organize exercises by workout type. Add sets with weight and reps.",
    },
    {
        icon: TrendingUp,
        title: "Stay consistent",
        description: "Build a habit by seeing your sessions stack up over time.",
    },
];

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

function LandingPage() {
    const { isSignedIn, isLoaded } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoaded && isSignedIn) navigate("/app", { replace: true });
    }, [isLoaded, isSignedIn]);

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-orange-300 bg-clip-text text-transparent">
                    LiftLog
                </span>
                <a
                    href="https://github.com/MoWe97/liftlog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <GithubLogoIcon size={20} />
                </a>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center gap-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                    Track your lifts.<br />
                    <span className="bg-gradient-to-r from-primary to-orange-300 bg-clip-text text-transparent">
                        See your progress.
                    </span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-md">
                    A clean, fast workout logger. Log sessions, track sets, and stay consistent.
                </p>
                <SignInButton mode="modal">
                    <Button size="lg" className="gap-2 mt-2">
                        <GoogleIcon />
                        Sign in with Google
                    </Button>
                </SignInButton>
            </main>

            <section className="px-6 py-16 border-t border-white/10">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map(({ icon: Icon, title, description }) => (
                        <div key={title} className="flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon size={20} className="text-primary" />
                            </div>
                            <h3 className="font-semibold">{title}</h3>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="px-6 py-6 border-t border-white/10 flex items-center justify-between text-sm text-muted-foreground">
                <span>Built by MoWe97</span>
                <a
                    href="https://github.com/MoWe97/liftlog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                    <GithubLogoIcon size={16} />
                    GitHub
                </a>
            </footer>
        </div>
    );
}

export default LandingPage;
