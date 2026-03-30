import HomePage from "@/pages/HomePage.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="liftlog-theme">
            <HomePage />
        </ThemeProvider>
    );
}

export default App;
