import { useState, useEffect, useCallback, useRef } from "react";

export const usePomodoro = (initialDuration: number) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialDuration * 60); // saniye cinsinden
  const [duration, setDuration] = useState(initialDuration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer çalışma mantığı - tek state ile optimize edilmiş
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, timeLeft]);

  // Timer'ı başlat/durdur
  const toggleTimer = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  // Timer'ı sıfırla
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  }, [duration]);

  // Duration değiştir
  const updateDuration = useCallback((newDuration: number) => {
    setDuration(newDuration);
    setTimeLeft(newDuration * 60);
    setIsActive(false);
  }, []);

  // Dakika ve saniye hesaplama (memoized)
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    isActive,
    minutes,
    seconds,
    duration,
    isLoading: false,
    toggleTimer,
    resetTimer,
    updateDuration,
  };
};
