"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimerProps {
  isActive: boolean;
  toggle: () => void;
  reset: () => void;
  duration: number;
  minutes: number;
  seconds: number;
  isLoading: boolean;
}

const Timer = ({
  isActive,
  toggle,
  reset,
  duration,
  minutes,
  seconds,
  isLoading,
}: TimerProps) => {
  function handleReset() {
    reset();
  }

  if (isLoading) {
    return (
      <div className="bg-white/10 p-6 sm:p-8 rounded-lg shadow-lg backdrop-blur-md w-full max-w-sm mx-auto my-6 sm:my-8 text-center">
        <div className="text-7xl sm:text-8xl font-bold text-white mb-4 sm:mb-6">
          <span>--</span>:<span>--</span>
        </div>
        <div className="text-white/70">Yükleniyor...</div>
      </div>
    );
  }

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
          aria-label={isActive ? "Timer'ı durdur" : "Timer'ı başlat"}>
          {isActive ? (
            <Pause size={28} className="sm:w-8 sm:h-8" />
          ) : (
            <Play size={28} className="sm:w-8 sm:h-8" />
          )}
        </button>
        <button
          onClick={handleReset}
          className="bg-white/30 text-white hover:bg-white/40 transition-all duration-300 font-bold p-3 sm:p-4 rounded-full shadow-lg"
          aria-label="Timer'ı sıfırla">
          <RotateCcw size={28} className="sm:w-8 sm:h-8" />
        </button>
      </div>
    </div>
  );
};

export default Timer;
