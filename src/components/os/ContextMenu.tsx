import { useRef, useCallback, useMemo, useEffect } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onOpenApp: (id: string) => void;
}

const menuItems = [
  { icon: "fa-solid fa-terminal", label: "Open Terminal", action: "terminal" },
  { icon: "fa-solid fa-gear", label: "Settings", action: "settings" },
  { divider: true },
  { icon: "fa-solid fa-rotate", label: "Refresh Desktop", action: "refresh" },
  { icon: "fa-solid fa-desktop", label: "Display Settings", action: "settings" },
  { divider: true },
  { icon: "fa-solid fa-search", label: "Search (Ctrl+K)", action: "search" },
  { icon: "fa-solid fa-keyboard", label: "Keyboard Shortcuts", action: "shortcuts" },
];

const MENU_WIDTH = 220;
const MENU_HEIGHT = 340;

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onOpenApp }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const pos = useMemo(() => {
    const adjustedX = x + MENU_WIDTH > window.innerWidth ? x - MENU_WIDTH : x;
    const adjustedY = y + MENU_HEIGHT > window.innerHeight ? y - MENU_HEIGHT : y;
    return { x: adjustedX, y: adjustedY };
  }, [x, y]);

  const handleAction = useCallback(
    (action: string) => {
      if (action === "refresh") {
        onClose();
        return;
      }
      if (action === "search") {
        window.dispatchEvent(new CustomEvent("open-search"));
        onClose();
        return;
      }
      if (action === "shortcuts") {
        window.dispatchEvent(new CustomEvent("open-shortcuts"));
        onClose();
        return;
      }
      onOpenApp(action);
      onClose();
    },
    [onOpenApp, onClose],
  );

  return (
    <div
      ref={menuRef}
      className="fixed rounded-sm border overflow-hidden z-[99999] animate-fade-in"
      style={{
        left: pos.x,
        top: pos.y,
        backgroundColor: "var(--color-bg-light)",
        borderColor: "var(--color-border-active)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.8), 0 0 1px var(--color-primary)",
        minWidth: 220,
      }}
    >
      <div
        className="px-3 py-2 text-[10px] font-bold tracking-wider"
        style={{
          color: "var(--color-text-muted)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        DESKTOP MENU
      </div>
      {menuItems.map((item, i) =>
        "divider" in item && item.divider ? (
          <div key={i} className="my-1" style={{ borderTop: "1px solid var(--color-border)" }} />
        ) : (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer text-sm transition-colors"
            style={{ color: "var(--color-text-dim)" }}
            onClick={() => handleAction(item.action!)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-primary-glow)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-text-dim)";
            }}
          >
            <i
              className={`${item.icon} w-4 text-center text-xs`}
              style={{ color: "var(--color-primary)" }}
            />
            <span>{item.label}</span>
          </div>
        ),
      )}
    </div>
  );
};
