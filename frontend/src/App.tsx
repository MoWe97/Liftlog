import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import HomePage from "@/pages/HomePage.tsx";
import ManagePage from "@/pages/ManagePage.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="liftlog-theme">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/manage" element={<ManagePage />} />
                </Routes>
            </BrowserRouter>
            <Toaster richColors />
        </ThemeProvider>
    );
}

export default App;
