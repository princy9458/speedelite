"use client";

import { Clock3 } from "lucide-react";
import PremiumSelect from "./PremiumSelect";

type TimePickerProps = {
  value?: string;
  onChange: (value: string) => void;
};

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const [currentHour = "", currentMinute = ""] = value?.split(":") || [];

  const hourOptions = Array.from({ length: 24 }, (_, item) => ({
    label: String(item).padStart(2, "0"),
    value: String(item).padStart(2, "0"),
  }));

  const minuteSteps = ["00", "15", "30", "45"];
  const minuteOptions = Array.from(new Set([...minuteSteps, currentMinute].filter(Boolean))).map((item) => ({
    label: item,
    value: item,
  }));

  return (
    <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
      <PremiumSelect
        value={currentHour}
        onChange={(nextHour) => onChange(`${nextHour}:${currentMinute || "00"}`)}
        options={hourOptions}
        placeholder="HH"
      />
      <PremiumSelect
        value={currentMinute}
        onChange={(nextMinute) => onChange(`${currentHour || "00"}:${nextMinute}`)}
        options={minuteOptions}
        placeholder="MM"
      />
      <div className="obsidian-surface flex items-center justify-center rounded-[1.1rem] px-4 text-[#F2CA50] shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
        <Clock3 className="h-4 w-4" />
      </div>
    </div>
  );
}
