"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerProps {
  isActive: boolean;
  toggle: () => void;
  reset: () => void;
  duration: number; // Duration in minutes
}

const Timer = ({ isActive, toggle, reset, duration }: TimerProps) => {
  const [minutes, setMinutes] = useState(duration);
  const [seconds, setSeconds] = useState(0);

  // Effect to update the timer when the duration prop changes
  useEffect(() => {
    setMinutes(duration);
    setSeconds(0);
  }, [duration]);

  function handleReset() {
    reset(); // from parent
    setMinutes(duration);
    setSeconds(0);
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            toggle(); // Notify parent that timer finished
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, minutes, toggle]);

  return (
    <div className="bg-white/10 p-6 sm:p-8 rounded-lg shadow-lg backdrop-blur-md w-full max-w-sm mx-auto my-6 sm:my-8 text-center">
      <div
        className="text-7xl sm:text-8xl font-bold text-white mb-4 sm:mb-6"
        style={{ fontVariantNumeric: "tabular-nums" }}>
        <span>{minutes < 10 ? `0${minutes}` : minutes}</span>:
        <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={toggle}
          className="bg-white text-gray-900 hover:bg-gray-200 transition-all duration-300 font-bold p-3 sm:p-4 rounded-full shadow-lg"
          aria-label={isActive ? "Pause timer" : "Start timer"}>
          {isActive ? (
            <Pause size={28} className="sm:w-8 sm:h-8" />
          ) : (
            <Play size={28} className="sm:w-8 sm:h-8" />
          )}
        </button>
        <button
          onClick={handleReset}
          className="bg-white/30 text-white hover:bg-white/40 transition-all duration-300 font-bold p-3 sm:p-4 rounded-full shadow-lg"
          aria-label="Reset timer">
          <RotateCcw size={28} className="sm:w-8 sm:h-8" />
        </button>
      </div>
    </div>
  );
};

export default Timer;
