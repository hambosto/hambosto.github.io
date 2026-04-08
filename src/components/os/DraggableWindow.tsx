import React, { useRef, useCallback, useEffect, type ReactNode } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';

interface DraggableWindowProps {
    windowId: string;
    title: string;
    icon?: string;
    children: ReactNode;
    className?: string;
}

export const DraggableWindow: React.FC<DraggableWindowProps> = ({
    windowId,
    title,
    icon,
    children,
    className = '',
}) => {
    const {
        windows,
        focusedId,
        closeWindow,
        focusWindow,
        minimizeWindow,
        maximizeWindow,
        updatePosition,
        updateSize,
    } = useWindowManager();

    const dragRef = useRef<HTMLDivElement>(null);
    const dragState = useRef({
        dragging: false,
        resizing: false,
        startX: 0,
        startY: 0,
        startWinX: 0,
        startWinY: 0,
        startW: 0,
        startH: 0,
    });

    const win = windows.find((w) => w.id === windowId);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (win?.maximized) return;
            focusWindow(windowId);
            dragState.current.dragging = true;
            dragState.current.startX = e.clientX;
            dragState.current.startY = e.clientY;
            dragState.current.startWinX = win?.x ?? 0;
            dragState.current.startWinY = win?.y ?? 0;
            e.preventDefault();
        },
        [windowId, focusWindow, win?.x, win?.y, win?.maximized]
    );

    const handleResizeMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (win?.maximized) return;
            focusWindow(windowId);
            dragState.current.resizing = true;
            dragState.current.startX = e.clientX;
            dragState.current.startY = e.clientY;
            dragState.current.startW = win?.width ?? 0;
            dragState.current.startH = win?.height ?? 0;
            e.preventDefault();
            e.stopPropagation();
        },
        [windowId, focusWindow, win?.width, win?.height, win?.maximized]
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const ds = dragState.current;
            if (ds.dragging) {
                const dx = e.clientX - ds.startX;
                const dy = e.clientY - ds.startY;
                updatePosition(windowId, ds.startWinX + dx, ds.startWinY + dy);
            }
            if (ds.resizing) {
                const dx = e.clientX - ds.startX;
                const dy = e.clientY - ds.startY;
                updateSize(windowId, Math.max(320, ds.startW + dx), Math.max(200, ds.startH + dy));
            }
        };
        const handleMouseUp = () => {
            dragState.current.dragging = false;
            dragState.current.resizing = false;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [windowId, updatePosition, updateSize]);

    if (!win) return null;

    const isFocused = focusedId === windowId;

    const style: React.CSSProperties = win.maximized
        ? {
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              zIndex: win.zIndex,
              backgroundColor: 'var(--color-bg)',
          }
        : {
              position: 'absolute',
              left: win.x,
              top: win.y,
              width: win.width,
              height: win.height,
              zIndex: win.zIndex,
              backgroundColor: 'var(--color-bg)',
          };

    return (
        <div
            className={`os-window animate-fade-in ${isFocused ? 'focused' : ''} ${win.minimized ? 'minimized' : ''} ${className}`}
            style={style}
            onClick={() => focusWindow(windowId)}
        >
            <div
                ref={dragRef}
                className="window-titlebar"
                onMouseDown={handleMouseDown}
                style={{
                    backgroundColor: 'var(--color-bg-light)',
                    borderBottomColor: 'var(--color-border)',
                }}
            >
                {icon && (
                    <i
                        className={`${icon} text-xs mr-2`}
                        style={{ color: 'var(--color-text-dim)' }}
                    />
                )}
                <span className="window-title" style={{ color: 'var(--color-text-dim)' }}>
                    {title}
                </span>
                <div className="window-controls">
                    <button
                        className="window-btn btn-minimize"
                        onClick={(e) => {
                            e.stopPropagation();
                            minimizeWindow(windowId);
                        }}
                        title="Minimize"
                    />
                    <button
                        className="window-btn btn-maximize"
                        onClick={(e) => {
                            e.stopPropagation();
                            maximizeWindow(windowId);
                        }}
                        title="Maximize"
                    />
                    <button
                        className="window-btn btn-close"
                        onClick={(e) => {
                            e.stopPropagation();
                            closeWindow(windowId);
                        }}
                        title="Close"
                    />
                </div>
            </div>
            <div className="window-body">{children}</div>
            {!win.maximized && (
                <div
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
                    onMouseDown={handleResizeMouseDown}
                    style={{
                        background: `linear-gradient(135deg, transparent 50%, var(--color-primary-dark) 50%)`,
                    }}
                />
            )}
        </div>
    );
};
