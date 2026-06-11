/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  prevBounds?: { x: number; y: number; width: number; height: number };
  zIndex: number;
}

interface WindowManagerValue {
  windows: WindowState[];
  focusedId: string | null;
  openWindow: (
    opts: Omit<WindowState, "zIndex" | "minimized" | "maximized"> & { maximized?: boolean },
  ) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
}

const WindowManagerContext = createContext<WindowManagerValue | null>(null);

let nextZ = 100;

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const openWindow = useCallback(
    (opts: Omit<WindowState, "zIndex" | "minimized" | "maximized">) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === opts.id);
        if (existing) {
          return prev.map((w) =>
            w.id === opts.id ? { ...w, minimized: false, zIndex: ++nextZ } : w,
          );
        }
        return [...prev, { ...opts, minimized: false, maximized: false, zIndex: ++nextZ }];
      });
      setFocusedId(opts.id);
    },
    [],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setFocusedId((prev) => (prev === id ? null : prev));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: ++nextZ } : w)));
    setFocusedId(id);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          return {
            ...w,
            maximized: false,
            x: w.prevBounds?.x ?? 100,
            y: w.prevBounds?.y ?? 50,
            width: w.prevBounds?.width ?? 700,
            height: w.prevBounds?.height ?? 450,
          };
        }
        return {
          ...w,
          maximized: true,
          prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight - 40,
        };
      }),
    );
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: ++nextZ } : w)));
    setFocusedId(id);
  }, []);

  const updatePosition = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const updateSize = useCallback((id: string, width: number, height: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, width, height } : w)));
  }, []);

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        focusedId,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        maximizeWindow,
        updatePosition,
        updateSize,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error("useWindowManager must be used within WindowManagerProvider");
  return ctx;
}
