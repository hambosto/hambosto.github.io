import { useState, useCallback } from "react";
import { useGitHub } from "./hooks/useGitHub";
import { CONFIG } from "./utils/config";
import { ThemeProvider } from "./context/ThemeContext";
import { WindowManagerProvider } from "./context/WindowManagerContext";
import { BootSequence } from "./components/os/BootSequence";
import { LoginScreen } from "./components/os/LoginScreen";
import { Desktop } from "./components/os/Desktop";
import { Taskbar } from "./components/os/Taskbar";

type AppPhase = "boot" | "login" | "desktop";

function AppContent() {
  const { data } = useGitHub(CONFIG.github.username);
  const [phase, setPhase] = useState<AppPhase>("boot");

  const handleBootComplete = useCallback(() => setPhase("login"), []);
  const handleLogin = useCallback(() => setPhase("desktop"), []);

  if (phase === "boot") return <BootSequence onComplete={handleBootComplete} />;
  if (phase === "login")
    return <LoginScreen onLogin={handleLogin} avatarUrl={data?.user?.avatar_url} />;

  return (
    <>
      <Desktop githubData={data ?? null} />
      <Taskbar githubData={data ?? null} />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <WindowManagerProvider>
        <AppContent />
        <div className="crt-overlay" />
      </WindowManagerProvider>
    </ThemeProvider>
  );
}

export default App;
