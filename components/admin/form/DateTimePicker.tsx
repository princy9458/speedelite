"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import PortalPopover from "./PortalPopover";
import PremiumSelect from "./PremiumSelect";
import { cn } from "@/lib/utils";

type DateTimePickerProps = {
  mode: "date" | "datetime";
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disablePast?: boolean;
  minDateTime?: Date | null;
  maxDateTime?: Date | null;
  helperText?: string;
};

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

const toDateOnlyString = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toDateTimeString = (value: Date) => {
  const date = toDateOnlyString(value);
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return `${date}T${hours}:${minutes}`;
};

const parseValue = (value?: string, mode: "date" | "datetime" = "date") => {
  if (!value) return null;
  const parsed = mode === "date" ? new Date(`${value}T00:00:00`) : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getMonthDays = (viewDate: Date) => {
  const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const days: Date[] = [];
  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() - start.getDay());
  const gridEnd = new Date(end);
  gridEnd.setDate(gridEnd.getDate() + (6 - end.getDay()));

  for (let day = new Date(gridStart); day <= gridEnd; day.setDate(day.getDate() + 1)) {
    days.push(new Date(day));
  }

  return days;
};

const isSameDate = (left?: Date | null, right?: Date | null) =>
  !!left &&
  !!right &&
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const buildDateTime = (date: Date, hour: number, minute: number) => {
  const next = new Date(date);
  next.setHours(hour, minute, 0, 0);
  return next;
};

export default function DateTimePicker({
  mode,
  value,
  onChange,
  placeholder,
  disablePast,
  minDateTime,
  maxDateTime,
  helperText,
}: DateTimePickerProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => parseValue(value, mode), [mode, value]);
  const [viewDate, setViewDate] = useState(() => selectedDate ?? new Date());
  const [draftDate, setDraftDate] = useState<Date | null>(selectedDate ?? null);
  const [hour, setHour] = useState(selectedDate ? String(selectedDate.getHours()).padStart(2, "0") : "");
  const [minute, setMinute] = useState(selectedDate ? String(selectedDate.getMinutes()).padStart(2, "0") : "");

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
      setDraftDate(selectedDate);
      setHour(String(selectedDate.getHours()).padStart(2, "0"));
      setMinute(String(selectedDate.getMinutes()).padStart(2, "0"));
      return;
    }

    if (!value) {
      setDraftDate(null);
      setHour("");
      setMinute("");
    }
  }, [selectedDate, value]);

  const hourOptions = Array.from({ length: 24 }, (_, item) => ({
    label: String(item).padStart(2, "0"),
    value: String(item).padStart(2, "0"),
  }));

  const minuteOptions = Array.from(new Set(["00", "15", "30", "45", minute].filter(Boolean))).map((item) => ({
    label: item,
    value: item,
  }));

  const commitValue = (date: Date, nextHour = hour, nextMinute = minute) => {
    if (mode === "date") {
      onChange(toDateOnlyString(date));
      return;
    }

    if (!nextHour || !nextMinute) {
      setDraftDate(date);
      return;
    }

    const nextDate = buildDateTime(date, Number(nextHour), Number(nextMinute));
    onChange(toDateTimeString(nextDate));
  };

  const isDayDisabled = (day: Date) => {
    if (disablePast) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (day < today) return true;
    }

    if (minDateTime) {
      const minDay = new Date(minDateTime);
      minDay.setHours(0, 0, 0, 0);
      if (day < minDay) return true;
    }

    if (maxDateTime) {
      const maxDay = new Date(maxDateTime);
      maxDay.setHours(0, 0, 0, 0);
      if (day > maxDay) return true;
    }

    return false;
  };

  const pendingDateLabel =
    mode === "datetime" && draftDate && !selectedDate
      ? `${draftDate.toLocaleDateString([], {
          year: "numeric",
          month: "short",
          day: "numeric",
        })} · Select booking close time`
      : null;

  const selectedLabel = selectedDate
    ? mode === "date"
      ? selectedDate.toLocaleDateString()
      : selectedDate.toLocaleString([], {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
    : pendingDateLabel || placeholder || "";

  const monthDays = getMonthDays(viewDate);

  const disableTimeOption = (nextHour: string, nextMinute: string) => {
    const baseDate = draftDate ?? selectedDate;
    if (!baseDate) return false;
    const candidate = buildDateTime(baseDate, Number(nextHour), Number(nextMinute));
    if (minDateTime && candidate < minDateTime) return true;
    if (maxDateTime && candidate > maxDateTime) return true;
    return false;
  };

  const handleDateSelection = (day: Date) => {
    if (mode === "date") {
      commitValue(day);
      setOpen(false);
      return;
    }

    const nextDate = new Date(draftDate ?? day);
    nextDate.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    setDraftDate(nextDate);
    setViewDate(nextDate);

    if (hour && minute) {
      commitValue(nextDate, hour, minute);
    }
  };

  return (
    <div className="space-y-2">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "obsidian-input flex min-h-[56px] w-full items-center justify-between px-4 py-3 text-left text-sm",
          selectedDate || pendingDateLabel ? "text-white" : "text-white/40"
        )}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        {mode === "datetime" ? <Clock3 className="h-4 w-4 text-[#F4D693]" /> : <Calendar className="h-4 w-4 text-[#F4D693]" />}
      </button>

      {helperText ? <p className="text-xs text-white/40">{helperText}</p> : null}

      <PortalPopover anchorEl={triggerRef.current} open={open} onClose={() => setOpen(false)} className="max-h-[420px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
              className="obsidian-ghost-button rounded-full p-2 text-white/70"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-medium tracking-[0.12em] text-[#f4edd9]">{monthFormatter.format(viewDate)}</p>
            <button
              type="button"
              onClick={() => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
              className="obsidian-ghost-button rounded-full p-2 text-white/70"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="obsidian-surface rounded-[22px] p-3">
            <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, index) => {
              const date = new Date(2024, 0, 7 + index);
              return (
                <span key={index} className="text-center text-[10px] uppercase tracking-[0.24em] text-white/35">
                  {weekdayFormatter.format(date)}
                </span>
              );
            })}
            {monthDays.map((day) => {
              const isDisabled = isDayDisabled(day);
              const isCurrentMonth = day.getMonth() === viewDate.getMonth();
              const isSelected = isSameDate(day, draftDate ?? selectedDate);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleDateSelection(day)}
                  className={cn(
                    "rounded-2xl px-0 py-3 text-sm transition",
                    isSelected
                      ? "bg-[linear-gradient(135deg,#F2CA50_0%,#D4AF37_100%)] font-semibold text-[#17120b] shadow-[0_12px_22px_rgba(150,116,14,0.22)]"
                      : isCurrentMonth
                      ? "text-white hover:bg-[rgba(242,202,80,0.08)]"
                      : "text-white/25 hover:bg-white/5",
                    isDisabled && "cursor-not-allowed opacity-25 hover:bg-transparent"
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
            </div>
          </div>

          {mode === "datetime" ? (
            <div className="obsidian-surface grid gap-3 rounded-[22px] p-3 sm:grid-cols-2">
              <PremiumSelect
                portal={false}
                value={hour || undefined}
                onChange={(nextValue) => {
                  setHour(nextValue);
                  if (draftDate) commitValue(draftDate, nextValue, minute);
                }}
                placeholder="HH"
                options={hourOptions.map((option) => ({
                  ...option,
                  disabled: draftDate ? disableTimeOption(option.value, minute || "00") : false,
                }))}
              />
              <PremiumSelect
                portal={false}
                value={minute || undefined}
                onChange={(nextValue) => {
                  setMinute(nextValue);
                  if (draftDate) commitValue(draftDate, hour, nextValue);
                }}
                placeholder="MM"
                options={minuteOptions.map((option) => ({
                  ...option,
                  disabled: draftDate ? disableTimeOption(hour || "00", option.value) : false,
                }))}
              />
            </div>
          ) : null}
        </div>
      </PortalPopover>
    </div>
  );
}
