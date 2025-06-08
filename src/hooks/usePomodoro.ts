import { useState, useEffect, useCallback } from "react";

export const usePomodoro = (initialDuration: number) => {
  const [isActive, setIsActive] = useState(false);
  const [minutes, setMinutes] = useState(initialDuration);
  const [seconds, setSeconds] = useState(0);
  const [duration, setDuration] = useState(initialDuration);

  // Timer çalışma mantığı
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer bitmiş
          setIsActive(false);
          // Burada bildirim çalabilir
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, minutes]);

  // Timer'ı başlat/durdur
  const toggleTimer = useCallback(() => {
    setIsActive(!isActive);
  }, [isActive]);

  // Timer'ı sıfırla
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setMinutes(duration);
    setSeconds(0);
  }, [duration]);

  // Duration değiştir
  const updateDuration = useCallback((newDuration: number) => {
    setDuration(newDuration);
    setMinutes(newDuration);
    setSeconds(0);
    setIsActive(false);
  }, []);

  return {
    isActive,
    minutes,
    seconds,
    duration,
    isLoading: false, // Artık loading yok
    toggleTimer,
    resetTimer,
    updateDuration,
  };
};
