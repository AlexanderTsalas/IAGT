"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Returns 0-based index where 0 = Monday (JS getDay: 0=Sun, 1=Mon … 6=Sat)
function getFirstWeekday(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function formatDateLong(d: Date) {
  return d.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

interface Props {
  onClose: () => void;
}

type View = "date" | "time" | "confirmed";

export default function AppointmentCalendar({ onClose }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view,         setView]         = useState<View>("date");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [viewYear,     setViewYear]     = useState(today.getFullYear());
  const [viewMonth,    setViewMonth]    = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (d < today) return true;
    const dow = d.getDay();
    return dow === 0 || dow === 6; // no weekends
  };

  const isSel   = (day: number) =>
    !!selectedDate &&
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth()    === viewMonth &&
    selectedDate.getDate()     === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth()    === viewMonth &&
    today.getDate()     === day;

  const handleDay = (day: number) => {
    if (isDisabled(day)) return;
    setSelectedDate(new Date(viewYear, viewMonth, day));
    setView("time");
  };

  const handleTime = (t: string) => {
    setSelectedTime(t);
    setView("confirmed");
  };

  // Build grid cells (nulls = empty leading cells)
  const firstWeekday = getFirstWeekday(viewYear, viewMonth);
  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  // ── Confirmed view ────────────────────────────────────────────────────────
  if (view === "confirmed") {
    const dateStr = formatDateLong(selectedDate!);
    const mailto  = `mailto:hello@iagt.com?subject=Appointment%20Request%20%E2%80%93%20${encodeURIComponent(dateStr)}%20${selectedTime}&body=I%20would%20like%20to%20book%20a%20discovery%20call%20on%20${encodeURIComponent(dateStr)}%20at%20${selectedTime}%20EET.`;

    return (
      <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "rgba(255,31,142,0.1)", border: "1px solid rgba(255,31,142,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.2rem",
        }}>
          <Check size={22} color="var(--pink)" strokeWidth={1.5} />
        </div>
        <h4 style={{ fontSize: "1.05rem", fontWeight: 300, color: "white", margin: "0 0 0.45rem" }}>
          Request Submitted
        </h4>
        <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "rgba(255,255,255,0.5)", margin: "0 0 0.25rem", lineHeight: 1.6 }}>
          {dateStr}
        </p>
        <p style={{ fontSize: "0.82rem", fontWeight: 300, color: "var(--pink)", margin: "0 0 1.75rem" }}>
          {selectedTime} EET
        </p>
        <a
          href={mailto}
          style={{
            display: "block", padding: "11px 0",
            background: "var(--pink)", color: "white",
            fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase",
            fontWeight: 500, borderRadius: "5px", textDecoration: "none",
            marginBottom: "0.75rem",
          }}
        >
          Confirm via Email →
        </a>
        <button
          onClick={() => { setView("date"); setSelectedDate(null); setSelectedTime(null); }}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", cursor: "pointer", fontFamily: "inherit" }}
        >
          ← Choose a different time
        </button>
      </div>
    );
  }

  // ── Time-slot view ────────────────────────────────────────────────────────
  if (view === "time") {
    return (
      <div>
        <button
          onClick={() => setView("date")}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", cursor: "pointer", padding: 0, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "4px", fontFamily: "inherit" }}
        >
          <ChevronLeft size={13} strokeWidth={1.5} />
          {formatDateLong(selectedDate!)}
        </button>
        <p style={{ fontSize: "0.65rem", letterSpacing: "0.24em", color: "var(--pink)", textTransform: "uppercase", margin: "0 0 1rem" }}>
          Select a time slot · EET (UTC+2)
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.55rem" }}>
          {TIME_SLOTS.map(t => (
            <button
              key={t}
              onClick={() => handleTime(t)}
              style={{
                padding: "10px 0",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,31,142,0.2)",
                borderRadius: "5px", color: "rgba(255,255,255,0.8)",
                fontSize: "0.88rem", fontWeight: 300, cursor: "pointer",
                fontFamily: "inherit", transition: "background 0.15s, border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background    = "rgba(255,31,142,0.1)";
                e.currentTarget.style.borderColor   = "rgba(255,31,142,0.6)";
                e.currentTarget.style.color         = "white";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background    = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor   = "rgba(255,31,142,0.2)";
                e.currentTarget.style.color         = "rgba(255,255,255,0.8)";
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Date-picker view ──────────────────────────────────────────────────────
  return (
    <div>
      {/* Month navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem" }}>
        <button
          onClick={prevMonth}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", cursor: "pointer", padding: "4px", display: "flex", lineHeight: 0 }}
        >
          <ChevronLeft size={17} strokeWidth={1.5} />
        </button>
        <span style={{ fontSize: "0.88rem", fontWeight: 300, color: "white", letterSpacing: "0.05em" }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.45)", cursor: "pointer", padding: "4px", display: "flex", lineHeight: 0 }}
        >
          <ChevronRight size={17} strokeWidth={1.5} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "0.3rem" }}>
        {DAY_HEADERS.map(d => (
          <div
            key={d}
            style={{
              textAlign: "center", fontSize: "0.6rem", letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.28)", textTransform: "uppercase",
              paddingBottom: "0.4rem",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "3px" }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const disabled = isDisabled(day);
          const selected = isSel(day);
          const today_   = isToday(day);

          return (
            <button
              key={idx}
              onClick={() => handleDay(day)}
              disabled={disabled}
              style={{
                aspectRatio: "1",
                background: selected ? "rgba(255,31,142,0.15)" : "transparent",
                border: selected
                  ? "1px solid rgba(255,31,142,0.7)"
                  : today_
                  ? "1px solid rgba(255,31,142,0.35)"
                  : "1px solid transparent",
                borderRadius: "5px",
                color: disabled
                  ? "rgba(255,255,255,0.18)"
                  : selected
                  ? "white"
                  : today_
                  ? "var(--pink)"
                  : "rgba(255,255,255,0.72)",
                fontSize: "0.8rem", fontWeight: 300,
                cursor: disabled ? "default" : "pointer",
                fontFamily: "inherit",
                transition: "background 0.12s, border-color 0.12s, color 0.12s",
              }}
              onMouseEnter={e => {
                if (!disabled && !selected) {
                  e.currentTarget.style.background  = "rgba(255,31,142,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,31,142,0.4)";
                  e.currentTarget.style.color       = "white";
                }
              }}
              onMouseLeave={e => {
                if (!disabled && !selected) {
                  e.currentTarget.style.background  = "transparent";
                  e.currentTarget.style.borderColor = today_ ? "rgba(255,31,142,0.35)" : "transparent";
                  e.currentTarget.style.color       = today_ ? "var(--pink)" : "rgba(255,255,255,0.72)";
                }
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: "0.7rem", fontWeight: 300, color: "rgba(255,255,255,0.25)", margin: "1rem 0 0", textAlign: "center" }}>
        Weekdays only · Eastern European Time
      </p>
    </div>
  );
}
