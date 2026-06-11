import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useWindowManager } from "../../context/WindowManagerContext";
import type { GitHubData } from "../../types/github";
import { TerminalApp } from "../apps/TerminalApp";
import { FileManagerApp } from "../apps/FileManagerApp";
import { TextEditorApp } from "../apps/TextEditorApp";
import { MailClientApp } from "../apps/MailClientApp";
import { SettingsApp } from "../apps/SettingsApp";
import { CalculatorApp } from "../apps/CalculatorApp";
import { TetrisGame } from "../games/TetrisGame";
import { SnakeGame } from "../games/SnakeGame";
import { FlappyBirdGame } from "../games/FlappyBirdGame";
import { DraggableWindow } from "./DraggableWindow";
import { MatrixScreensaver } from "./MatrixScreensaver";
import { Wallpaper } from "./Wallpaper";
import { ContextMenu } from "./ContextMenu";
import { SpotlightSearch } from "./SpotlightSearch";
import { NotificationToast, pushNotification } from "./NotificationToast";
import { ShortcutsModal } from "./ShortcutsModal";

interface DesktopProps {
  githubData: GitHubData | null;
}

const desktopIcons = [
  { id: "terminal", name: "Terminal", icon: "fa-solid fa-terminal" },
  { id: "files", name: "Projects", icon: "fa-solid fa-folder-open" },
  { id: "editor", name: "About Me", icon: "fa-solid fa-file-lines" },
  { id: "calculator", name: "Calculator", icon: "fa-solid fa-calculator" },
  { id: "mail", name: "Contact", icon: "fa-solid fa-envelope" },
  { id: "settings", name: "Settings", icon: "fa-solid fa-gear" },
  { id: "tetris", name: "Tetris", icon: "fa-solid fa-gamepad" },
  { id: "snake", name: "Snake", icon: "fa-solid fa-worm" },
  { id: "flappy", name: "Flappy Bird", icon: "fa-solid fa-dove" },
];

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export const Desktop: React.FC<DesktopProps> = ({ githubData }) => {
  const { openWindow, focusWindow, windows, maximizeWindow, minimizeWindow, closeWindow } =
    useWindowManager();
  const [initialized, setInitialized] = useState(false);
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showClock, setShowClock] = useState(true);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [matrixMode, setMatrixMode] = useState(false);
  const [uptime] = useState(() => Date.now());
  const SCREENSAVER_TIMEOUT = useMemo(() => 5 * 60 * 1000, []);

  const handleOpen = useCallback(
    (appId: string) => {
      const icon = desktopIcons.find((i) => i.id === appId);
      if (!icon) return;
      const existing = windows.find((w) => w.id === appId);
      if (existing) {
        if (existing.minimized) {
          openWindow({
            id: appId,
            title: icon.name,
            icon: icon.icon,
            x: existing.x,
            y: existing.y,
            width: existing.width,
            height: existing.height,
          });
        } else {
          focusWindow(appId);
        }
        return;
      }
      const offset = windows.length * 30;
      let width = 650;
      let height = 520;
      if (appId === "terminal") {
        width = 750;
        height = 480;
      } else if (appId === "files") {
        width = 850;
        height = 520;
      } else if (appId === "calculator") {
        width = 400;
        height = 550;
      }
      openWindow({
        id: appId,
        title: icon.name,
        icon: icon.icon,
        x: 180 + offset,
        y: 50 + offset,
        width,
        height,
      });
    },
    [openWindow, focusWindow, windows],
  );

  const welcomeSent = useRef(false);
  const lastActivityRef = useRef(0);

  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!initialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialized(true);
      setTimeout(() => handleOpen("editor"), 600);
      if (!welcomeSent.current) {
        welcomeSent.current = true;
        setTimeout(() => {
          pushNotification({
            title: "Welcome!",
            message: "Portfolio OS v3.0.2 loaded. Right-click desktop for options.",
            icon: "fa-solid fa-terminal",
            type: "info",
            duration: 5000,
          });
        }, 2000);
      }
    }
  }, [initialized, handleOpen]);

  useEffect(() => {
    const resetTimer = () => {
      lastActivityRef.current = Date.now();
      if (showScreensaver) setShowScreensaver(false);
    };
    const checkIdle = () => {
      if (!showScreensaver && Date.now() - lastActivityRef.current > SCREENSAVER_TIMEOUT) {
        setShowScreensaver(true);
      }
    };
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    const interval = setInterval(checkIdle, 1000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearInterval(interval);
    };
  }, [showScreensaver, SCREENSAVER_TIMEOUT]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[konamiIndex]) {
        const next = konamiIndex + 1;
        if (next === KONAMI_CODE.length) {
          pushNotification({
            title: "🎮 Konami Code!",
            message: "You found the secret! +30 lives... just kidding. But nice!",
            icon: "fa-solid fa-gamepad",
            type: "success",
            duration: 6000,
          });
          setKonamiIndex(0);
        } else {
          setKonamiIndex(next);
        }
      } else {
        setKonamiIndex(0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [konamiIndex]);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(".os-window, .taskbar, .start-menu")) return;
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    };
    const handleClick = () => setContextMenu(null);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    window.addEventListener("open-shortcuts", () => setContextMenu(null));
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("open-shortcuts", () => {});
    };
  }, []);

  useEffect(() => {
    const handleToggleMatrix = () => setMatrixMode((prev) => !prev);
    window.addEventListener("toggle-matrix", handleToggleMatrix);
    return () => window.removeEventListener("toggle-matrix", handleToggleMatrix);
  }, []);

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const formatUptime = useCallback((startTime: number) => {
    if (startTime === 0) return "0s";
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(diff / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m`;
    if (m > 0) return `${m}m ${diff % 60}s`;
    return `${diff}s`;
  }, []);

  return (
    <>
      {/* 1. Desktop background — z-index 1 */}
      <div
        className="fixed"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: "40px",
          backgroundColor: "var(--color-bg-dark)",
          zIndex: 1,
        }}
      >
        <Wallpaper />
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0.08 }}
        >
          <pre
            className="ascii-art hidden sm:block"
            style={{
              color: "var(--color-primary)",
              fontSize: "clamp(6px, 1.2vw, 14px)",
              lineHeight: "1.1",
              letterSpacing: "2px",
              textShadow:
                "0 0 20px var(--color-primary-glow-strong), 0 0 40px var(--color-primary-glow)",
            }}
          >
            {`
 ██╗  ██╗ █████╗ ███╗   ███╗██████╗  ██████╗ ███████╗████████╗ ██████╗ 
 ██║  ██║██╔══██╗████╗ ████║██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔═══██╗
 ███████║███████║██╔████╔██║██████╔╝██║   ██║███████╗   ██║   ██║   ██║
 ██╔══██║██╔══██║██║╚██╔╝██║██╔══██╗██║   ██║╚════██║   ██║   ██║   ██║
 ██║  ██║██║  ██║██║ ╚═╝ ██║██████╔╝╚██████╔╝███████║   ██║   ╚██████╔╝
 ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝ 
`}
          </pre>
        </div>
      </div>

      {/* 2. Desktop icons — z-index 10, hidden on mobile */}
      <div className="fixed top-4 left-4 flex flex-col gap-1 hidden sm:flex" style={{ zIndex: 10 }}>
        {desktopIcons.map((icon) => (
          <div key={icon.id} className="desktop-icon" onClick={() => handleOpen(icon.id)}>
            <i
              className={`${icon.icon} text-2xl`}
              style={{
                color: "var(--color-primary)",
                filter: "drop-shadow(0 0 4px var(--color-primary-glow-strong))",
              }}
            />
            <span className="desktop-icon-label">{icon.name}</span>
          </div>
        ))}
      </div>

      {/* Mobile app launcher grid */}
      <div
        className="fixed inset-0 flex items-center justify-center sm:hidden p-4"
        style={{ zIndex: 5, bottom: "40px" }}
      >
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          {desktopIcons.map((icon) => (
            <div
              key={icon.id}
              className="flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer active:scale-95 transition-transform"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid var(--color-border)",
              }}
              onClick={() => handleOpen(icon.id)}
            >
              <i className={`${icon.icon} text-2xl`} style={{ color: "var(--color-primary)" }} />
              <span className="text-[10px] text-center" style={{ color: "var(--color-text-dim)" }}>
                {icon.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Desktop widgets */}
      {showClock && (
        <div
          className="hidden md:block fixed right-4 top-4 px-4 py-3 rounded-sm border select-none"
          style={{
            zIndex: 10,
            backgroundColor: "rgba(10,10,10,0.85)",
            borderColor: "var(--color-border)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="text-2xl font-bold font-mono"
            style={{
              color: "var(--color-primary)",
              textShadow: "0 0 10px var(--color-primary-glow-strong)",
            }}
          >
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <div className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>
            {time.toLocaleDateString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "var(--color-text-dim)" }}>
            Uptime: {formatUptime(uptime)} · {windows.length} window
            {windows.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Quick action buttons */}
      <div className="hidden md:flex fixed left-4 bottom-4 gap-2" style={{ zIndex: 10 }}>
        <button
          className="px-2.5 py-1.5 text-[10px] rounded-sm border font-bold transition-all hover:scale-105 active:scale-95"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-dim)",
            backgroundColor: "rgba(10,10,10,0.8)",
          }}
          onClick={() => windows.forEach((w) => maximizeWindow(w.id))}
          title="Maximize all windows"
        >
          <i className="fa-solid fa-expand mr-1" />
          MAX ALL
        </button>
        <button
          className="px-2.5 py-1.5 text-[10px] rounded-sm border font-bold transition-all hover:scale-105 active:scale-95"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-dim)",
            backgroundColor: "rgba(10,10,10,0.8)",
          }}
          onClick={() => windows.forEach((w) => minimizeWindow(w.id))}
          title="Minimize all windows"
        >
          <i className="fa-solid fa-compress mr-1" />
          MIN ALL
        </button>
        <button
          className="px-2.5 py-1.5 text-[10px] rounded-sm border font-bold transition-all hover:scale-105 active:scale-95"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-dim)",
            backgroundColor: "rgba(10,10,10,0.8)",
          }}
          onClick={() => windows.forEach((w) => closeWindow(w.id))}
          title="Close all windows"
        >
          <i className="fa-solid fa-xmark mr-1" />
          CLOSE ALL
        </button>
        <button
          className="px-2.5 py-1.5 text-[10px] rounded-sm border font-bold transition-all hover:scale-105 active:scale-95"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-dim)",
            backgroundColor: "rgba(10,10,10,0.8)",
          }}
          onClick={() => setMatrixMode((prev) => !prev)}
          title="Toggle matrix screensaver"
        >
          <i className="fa-solid fa-code mr-1" />
          MATRIX
        </button>
        <button
          className="px-2.5 py-1.5 text-[10px] rounded-sm border font-bold transition-all hover:scale-105 active:scale-95"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-dim)",
            backgroundColor: "rgba(10,10,10,0.8)",
          }}
          onClick={() => setShowClock((prev) => !prev)}
          title="Toggle clock widget"
        >
          <i className={`fa-solid ${showClock ? "fa-eye" : "fa-eye-slash"} mr-1`} />
          CLOCK
        </button>
      </div>

      {/* 4. Windows — z-index 100+, rendered at root level */}
      <WindowRenderer githubData={githubData} />

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onOpenApp={handleOpen}
        />
      )}

      {/* Spotlight Search */}
      <SpotlightSearch />

      {/* Shortcuts Modal */}
      <ShortcutsModal />

      {/* Notification Toasts */}
      <NotificationToast />

      {/* Matrix screensaver */}
      {(showScreensaver || matrixMode) && (
        <MatrixScreensaver
          onWake={() => {
            setShowScreensaver(false);
            setMatrixMode(false);
          }}
        />
      )}
    </>
  );
};

const WindowRenderer: React.FC<{ githubData: GitHubData | null }> = ({ githubData }) => {
  const { windows } = useWindowManager();
  const user = githubData?.user ?? null;

  return (
    <>
      {windows.map((win) => (
        <DraggableWindow key={win.id} windowId={win.id} title={win.title} icon={win.icon}>
          {win.id === "terminal" && <TerminalApp githubData={githubData} />}
          {win.id === "files" && <FileManagerApp githubData={githubData} />}
          {win.id === "editor" && <TextEditorApp user={user} />}
          {win.id === "calculator" && <CalculatorApp />}
          {win.id === "mail" && <MailClientApp />}
          {win.id === "settings" && <SettingsApp />}
          {win.id === "tetris" && <TetrisGame />}
          {win.id === "snake" && <SnakeGame />}
          {win.id === "flappy" && <FlappyBirdGame />}
        </DraggableWindow>
      ))}
    </>
  );
};
