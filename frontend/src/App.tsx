import HomePage from "@/pages/HomePage.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";

function App() {
  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <HomePage></HomePage>
      </ThemeProvider>
  );
}

export default App
