'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isAfter, isBefore, isWithinInterval } from 'date-fns';
import { DateRange } from "react-day-picker";

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  setDate: (range: DateRange | undefined) => void;
}

function getDaysInMonthGrid(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const days: Date[] = [];
  let current = start;
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }
  return days;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function DatePickerWithRange({ date, setDate }: DatePickerWithRangeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [baseMonth, setBaseMonth] = useState(() => startOfMonth(date?.from ?? new Date()));
  const [selectionStart, setSelectionStart] = useState<Date | null>(date?.from ?? null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(date?.to ?? null);
  
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [picking, setPicking] = useState<'start' | 'end'>('start');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setSelectionStart(date?.from ?? null);
    setSelectionEnd(date?.to ?? null);
    if (date?.from) {
      setBaseMonth(startOfMonth(date.from));
    }
  }, [date]);

  const secondMonth = addMonths(baseMonth, 1);

  const handleDayClick = useCallback((day: Date) => {
    if (picking === 'start') {
      setSelectionStart(day);
      setSelectionEnd(null);
      setPicking('end');
    } else {
      if (selectionStart && isBefore(day, selectionStart)) {
        setSelectionStart(day);
        setSelectionEnd(null);
        setPicking('end');
        return;
      }
      setSelectionEnd(day);
      setPicking('start');
      if (selectionStart) {
        setDate({ from: selectionStart, to: day });
      }
      setTimeout(() => setIsOpen(false), 220);
    }
  }, [picking, selectionStart, setDate]);

  function getDayClasses(day: Date, month: Date) {
    const isOutside = !isSameMonth(day, month);
    const isStart = selectionStart && isSameDay(day, selectionStart);
    const isEnd = selectionEnd && isSameDay(day, selectionEnd);
    const isToday = isSameDay(day, new Date());

    const effectiveEnd = picking === 'end' && selectionStart && hoveredDate && isAfter(hoveredDate, selectionStart)
      ? hoveredDate
      : selectionEnd;

    const inRange = selectionStart && effectiveEnd
      ? isWithinInterval(day, {
          start: selectionStart,
          end: effectiveEnd,
        })
      : false;

    const isRangeStart = isStart;
    const isRangeEnd = effectiveEnd && isSameDay(day, effectiveEnd);

    let base = 'relative h-9 w-9 text-[13px] font-medium rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-center ';

    if (isOutside) {
      base += 'text-gray-600 pointer-events-none ';
    } else if (isRangeStart || isRangeEnd) {
      base += 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 z-10 ';
    } else if (inRange) {
      base += 'bg-white/[0.08] text-cyan-200 ';
    } else if (isToday) {
      base += 'text-cyan-400 ring-1 ring-cyan-400/40 ';
    } else {
      base += 'text-gray-300 hover:bg-white/[0.06] hover:text-white ';
    }

    let wrapperClass = 'flex items-center justify-center ';
    if (inRange && !isRangeStart && !isRangeEnd) {
      wrapperClass += 'bg-white/[0.04] ';
    }
    if (isRangeStart && inRange) {
      wrapperClass += 'rounded-l-lg bg-gradient-to-r from-white/[0.06] to-white/[0.04] ';
    }
    if (isRangeEnd && inRange) {
      wrapperClass += 'rounded-r-lg bg-gradient-to-l from-white/[0.06] to-white/[0.04] ';
    }

    return { dayClass: base, wrapperClass };
  }

  function renderMonth(month: Date) {
    const days = getDaysInMonthGrid(month);

    return (
      <div className="w-70">
        <div className="text-center text-sm font-semibold text-gray-200 mb-3 tracking-wide">
          {format(month, 'MMMM yyyy')}
        </div>

        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="h-8 flex items-center justify-center text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              {wd}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const { dayClass, wrapperClass } = getDayClasses(day, month);
            const isOutside = !isSameMonth(day, month);

            return (
              <div key={i} className={wrapperClass}>
                <button
                  type="button"
                  disabled={isOutside}
                  className={dayClass}
                  onClick={() => !isOutside && handleDayClick(day)}
                  onMouseEnter={() => !isOutside && setHoveredDate(day)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  {format(day, 'd')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const label = selectionStart
    ? selectionEnd
      ? `${format(selectionStart, 'MMM d, yyyy')} – ${format(selectionEnd, 'MMM d, yyyy')}`
      : `${format(selectionStart, 'MMM d, yyyy')} – …`
    : 'All Time';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2.5 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-gray-300 backdrop-blur-md transition-all hover:bg-white/8 hover:text-white hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
      >
        <Calendar className="h-4 w-4 text-cyan-400/80" />
        <span>{label}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-2 origin-top-right animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0d1117]/95 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4 px-1">
              <button
                type="button"
                onClick={() => setBaseMonth(subMonths(baseMonth, 1))}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {picking === 'end' && selectionStart && (
                <span className="text-xs text-cyan-400/70 font-medium">
                  Select end date
                </span>
              )}

              <button
                type="button"
                onClick={() => setBaseMonth(addMonths(baseMonth, 1))}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-6">
              {renderMonth(baseMonth)}
              {renderMonth(secondMonth)}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/6">
              {[
                { label: '7d', days: 7 },
                { label: '14d', days: 14 },
                { label: '30d', days: 30 },
                { label: '90d', days: 90 },
              ].map(({ label: l, days }) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    const to = new Date();
                    const from = addDays(to, -days);
                    setSelectionStart(from);
                    setSelectionEnd(to);
                    setDate({ from, to });
                    setPicking('start');
                    setTimeout(() => setIsOpen(false), 180);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-gray-400 rounded-lg hover:bg-white/6 hover:text-white transition-colors"
                >
                  {l}
                </button>
              ))}
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => {
                  setSelectionStart(null);
                  setSelectionEnd(null);
                  setPicking('start');
                  setDate(undefined);
                  setIsOpen(false);
                }}
                className="px-3 py-1.5 text-xs font-medium text-gray-500 rounded-lg hover:bg-white/6 hover:text-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}