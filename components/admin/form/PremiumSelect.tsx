"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import PortalPopover from "./PortalPopover";
import { cn } from "@/lib/utils";

type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type PremiumSelectProps = {
  value?: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  portal?: boolean;
  className?: string;
};

export default function PremiumSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled,
  portal = true,
  className,
}: PremiumSelectProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = useState(false);
  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value && !option.disabled),
    [options, value]
  );
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedLabel = useMemo(
    () => options.find((option) => option.value === value)?.label ?? placeholder,
    [options, placeholder, value]
  );

  useEffect(() => {
    const fallbackIndex = options.findIndex((option) => !option.disabled);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : fallbackIndex);
  }, [open, options, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const nextOption = optionRefs.current[activeIndex];
    nextOption?.focus();
  }, [activeIndex, open]);

  const commitSelection = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  const moveHighlight = (direction: 1 | -1) => {
    const total = options.length;
    if (!total || options.every((option) => option.disabled)) return;

    setActiveIndex((current) => {
      let nextIndex = current >= 0 ? current : direction > 0 ? -1 : total;

      for (let step = 0; step < total; step += 1) {
        nextIndex = (nextIndex + direction + total) % total;
        if (!options[nextIndex]?.disabled) {
          return nextIndex;
        }
      }

      return current;
    });
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const fallbackIndex = options.findIndex((option) => !option.disabled);
      setOpen(true);
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : fallbackIndex);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((current) => !current);
    }
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveHighlight(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveHighlight(-1);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const nextValue = options[activeIndex]?.disabled ? undefined : options[activeIndex]?.value;
      if (nextValue) commitSelection(nextValue);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "obsidian-input flex min-h-[56px] w-full items-center justify-between px-4 py-3 text-left text-sm",
          value ? "text-white" : "text-white/40",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={cn("h-4 w-4 text-[#F4D693] transition-transform", open && "rotate-180")} />
      </button>

      <PortalPopover
        anchorEl={triggerRef.current}
        open={open}
        onClose={() => setOpen(false)}
        portal={portal}
        className="max-h-[320px]"
      >
        <div
          className="max-h-[290px] space-y-1 overflow-y-auto pr-1"
          role="listbox"
          aria-activedescendant={activeIndex >= 0 ? options[activeIndex]?.value : undefined}
        >
          {options.some((option) => !option.disabled) ? (
            options.map((option, index) => {
              const active = option.value === value;
              const highlighted = index === activeIndex;
              return (
                <button
                  key={option.value}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  id={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => {
                    if (option.disabled) return;
                    commitSelection(option.value);
                  }}
                  onKeyDown={handleOptionKeyDown}
                  role="option"
                  aria-selected={active}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm transition focus:outline-none",
                    option.disabled
                      ? "cursor-not-allowed text-white/20"
                      : active
                      ? "bg-[#F2CA50]/14 text-[#F7DB88]"
                      : highlighted
                      ? "bg-[rgba(242,202,80,0.09)] text-[#f4edd9]"
                      : "text-white/70 hover:bg-[rgba(242,202,80,0.08)] hover:text-[#fff3d0]"
                  )}
                >
                  <span>{option.label}</span>
                  {active ? <Check className="h-4 w-4" /> : null}
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl px-3 py-3 text-sm text-white/35">No options available</div>
          )}
        </div>
      </PortalPopover>
    </div>
  );
}
