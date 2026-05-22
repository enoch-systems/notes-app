"use client";

import { useState, useEffect } from "react";

type TimeTarget = { label: string; hour: number; minute: number };

const targets: TimeTarget[] = [
  { label: "7 AM", hour: 7, minute: 0 },
  { label: "11 AM", hour: 11, minute: 0 },
  { label: "5 PM", hour: 17, minute: 0 },
  { label: "9 PM", hour: 21, minute: 0 },
];

function msUntil(h: number, m: number): number {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

function formatCountdown(ms: number): { hh: string; mm: string; ss: string } {
  const totalSec = Math.floor(ms / 1000);
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  return {
    hh: String(hh).padStart(2, "0"),
    mm: String(mm).padStart(2, "0"),
    ss: String(ss).padStart(2, "0"),
  };
}

export default function DayProgress() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) {
    return <div className="px-4 pb-2.5" />;
  }

  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msElapsed = now.getTime() - dayStart.getTime();
  const dayMs = 86400000;
  const msLeft = dayMs - msElapsed;
  const percent = Math.min((msElapsed / dayMs) * 100, 100);
  const hoursGone = Math.floor(msElapsed / 3600000);
  const minutesGone = Math.floor((msElapsed % 3600000) / 60000);
  const secondsGone = Math.floor((msElapsed % 60000) / 1000);
  const hoursLeft = Math.floor(msLeft / 3600000);
  const minutesLeft = Math.floor((msLeft % 3600000) / 60000);
  const secondsLeft = Math.floor((msLeft % 60000) / 1000);

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="px-4 pb-2.5 space-y-3">
      {/* Current time + day progress — Apple-style minimal */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-semibold tracking-tight text-zinc-700 dark:text-zinc-300 min-w-[60px]">
          {timeStr}
        </span>
        <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000 ease-linear"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[11px] font-medium tabular-nums text-zinc-400 dark:text-zinc-500 min-w-[44px] text-right">
          {percent.toFixed(0)}%
        </span>
      </div>
    
      {/* Hours gone since midnight */}
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-red-500" />
        <span className="text-[12px] font-semibold text-red-500 tabular-nums">
          {String(hoursGone).padStart(2, "0")}h {String(minutesGone).padStart(2, "0")}m {String(secondsGone).padStart(2, "0")}s
        </span>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          gone since 12 AM
        </span>
      </div>

      {/* Hours left until midnight */}
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-[12px] font-semibold text-green-500 tabular-nums">
          {String(hoursLeft).padStart(2, "0")}h {String(minutesLeft).padStart(2, "0")}m {String(secondsLeft).padStart(2, "0")}s
        </span>
        <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
          left until 12 AM
        </span>
      </div>

      {/* Countdown cards — Apple-style frosted glass */}
      <div className="grid grid-cols-4 gap-2">
        {targets.map((t) => {
          const { hh, mm, ss } = formatCountdown(msUntil(t.hour, t.minute));
          return (
            <div
              key={t.label}
              className="flex flex-col items-center rounded-2xl bg-white/70 px-2 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] ring-1 ring-zinc-200/50 backdrop-blur-xl dark:bg-zinc-900/70 dark:ring-zinc-800/50"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
                {t.label}
              </span>
              <span className="font-mono text-[13px] font-semibold tracking-wide tabular-nums text-zinc-800 dark:text-zinc-200">
                {hh}:{mm}:{ss}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}