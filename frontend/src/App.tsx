import HomePage from "@/pages/HomePage.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="liftlog-theme">
            <HomePage />
            <Toaster richColors />
        </ThemeProvider>
    );
}

export default App;
