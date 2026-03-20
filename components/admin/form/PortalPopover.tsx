"use client";

import { type ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type PortalPopoverProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  matchWidth?: boolean;
  portal?: boolean;
};

export default function PortalPopover({
  anchorEl,
  open,
  onClose,
  children,
  className,
  matchWidth = true,
  portal = true,
}: PortalPopoverProps) {
  const popoverId = useId();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [style, setStyle] = useState<Record<string, number | string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);

      if (!anchorEl || mobile || !portal) return;

      const rect = anchorEl.getBoundingClientRect();
      const estimatedHeight = 380;
      const availableBelow = window.innerHeight - rect.bottom;
      const placeAbove = availableBelow < estimatedHeight && rect.top > availableBelow;
      const width = matchWidth ? Math.max(rect.width, 280) : 320;
      const availableHeight = placeAbove ? rect.top - 24 : window.innerHeight - rect.bottom - 24;

      setStyle({
        position: "fixed",
        left: Math.min(rect.left, window.innerWidth - width - 16),
        top: placeAbove ? Math.max(rect.top - estimatedHeight - 10, 16) : rect.bottom + 10,
        width,
        maxHeight: Math.max(Math.min(availableHeight, estimatedHeight), 240),
        zIndex: 1200,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorEl, matchWidth, open, portal]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!anchorEl) return;
      const target = event.target as Node;
      if (anchorEl.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      onClose();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [anchorEl, onClose, open]);

  const content = useMemo(() => {
    if (!open) return null;

    if (isMobile && portal) {
      return (
        <div className="fixed inset-0 z-[1200] flex items-end bg-black/60 p-3 backdrop-blur-sm sm:hidden">
          <div
            ref={popoverRef}
            data-portal-popover={popoverId}
            className={cn(
              "premium-popover-enter obsidian-panel max-h-[78vh] w-full overflow-hidden rounded-[24px] p-4",
              className
            )}
          >
            {children}
          </div>
        </div>
      );
    }

    if (!portal) {
      return (
        <div
          ref={popoverRef}
          data-portal-popover={popoverId}
          className={cn(
            "premium-popover-enter obsidian-panel absolute left-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-[20px] p-3",
            className
          )}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={popoverRef}
        data-portal-popover={popoverId}
        style={style}
        className={cn(
          "premium-popover-enter obsidian-panel overflow-hidden rounded-[20px] p-3",
          className
        )}
      >
        {children}
      </div>
    );
  }, [children, className, isMobile, open, portal, style]);

  if (!mounted || !content) return null;
  return portal ? createPortal(content, document.body) : content;
}
