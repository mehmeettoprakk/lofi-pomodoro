"use client";

import { useState, useMemo, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import Timer from "@/components/Timer";
import Player from "@/components/Player";
import MoodSelector from "@/components/MoodSelector";
import { Settings, Video, VideoOff } from "lucide-react";
import VolumeControl from "@/components/VolumeControl";
import { usePomodoro } from "@/hooks/usePomodoro";

// Lazy imports - kritik olmayan komponentleri geciktir
const BackgroundVideo = lazy(() => import("@/components/BackgroundVideo"));
const SettingsModal = lazy(() => import("@/components/SettingsModal"));
const TodoList = lazy(() => import("@/components/TodoList"));

// Yerel ses dosyaları
const moods = [
  {
    name: "Ocean Waves",
    url: "/audio/waves.mp3",
    videoMode: "waves" as const,
  },
  {
    name: "Rainy Day",
    url: "/audio/rain.mp3",
    videoMode: "rain" as const,
  },
  {
    name: "Fireplace",
    url: "/audio/fireplace.mp3",
    videoMode: "fireplace" as const,
  },
];

// Cihaz performans tespiti
const getDeviceInfo = () => {
  if (typeof window === "undefined")
    return { isMobile: false, isLowEnd: false };

  const isMobile =
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // Düşük performanslı cihaz tespiti
  const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
  const isLowEnd =
    navigator.hardwareConcurrency <= 2 ||
    (deviceMemory && deviceMemory <= 2) ||
    /Android.*[4-6]\./i.test(navigator.userAgent) ||
    window.innerWidth < 480;

  return { isMobile, isLowEnd };
};

// Optimized animation variants - performans için hafifletildi
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

// Loading fallback component
const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-white/50`}></div>
    </div>
  );
};

export default function Home() {
  const deviceInfo = useMemo(() => getDeviceInfo(), []);

  // Pomodoro hook'unu kullan
  const {
    isActive,
    minutes,
    seconds,
    duration,
    isLoading,
    toggleTimer,
    resetTimer,
    updateDuration,
  } = usePomodoro(25); // 25 dakika varsayılan

  const [currentStreamUrl, setCurrentStreamUrl] = useState(moods[0].url);
  const [currentVideoMode, setCurrentVideoMode] = useState<
    "waves" | "rain" | "fireplace"
  >(moods[0].videoMode);

  // Düşük performanslı cihazlarda video varsayılan kapalı
  const [isVideoEnabled, setIsVideoEnabled] = useState(
    !deviceInfo.isLowEnd && !deviceInfo.isMobile
  );

  // State'ler
  const [volume, setVolume] = useState(0.5);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleMoodChange = useMemo(
    () => (url: string) => {
      setCurrentStreamUrl(url);
      const selectedMood = moods.find((mood) => mood.url === url);
      if (selectedMood) {
        setCurrentVideoMode(selectedMood.videoMode);
      }
    },
    []
  );

  const handleDurationChange = useMemo(
    () => (newDuration: number) => {
      updateDuration(newDuration);
    },
    [updateDuration]
  );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Background Video - sadece yüksek performanslı cihazlarda, lazy loaded */}
      <Suspense fallback={null}>
        {!deviceInfo.isLowEnd && (
          <BackgroundVideo
            mode={currentVideoMode}
            isEnabled={isVideoEnabled}
            onToggle={() => setIsVideoEnabled((prev) => !prev)}
          />
        )}
      </Suspense>

      {/* Ana container - tek sütun */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg mx-auto space-y-6">
        {/* Üst kısım - Header */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Pomodoro Focus
          </h1>
          <div className="flex items-center space-x-2">
            {/* Video toggle - sadece desteklenen cihazlarda */}
            {!deviceInfo.isLowEnd && deviceInfo.isMobile && (
              <button
                onClick={() => setIsVideoEnabled((prev) => !prev)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isVideoEnabled
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                } border border-current/20`}
                title={isVideoEnabled ? "Videoyu Kapat" : "Videoyu Aç"}>
                {isVideoEnabled ? <VideoOff size={20} /> : <Video size={20} />}
              </button>
            )}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-white/70 hover:text-white transition-colors p-2">
              <Settings size={20} />
            </button>
          </div>
        </motion.div>

        {/* Timer */}
        <motion.div variants={itemVariants}>
          <Timer
            isActive={isActive}
            toggle={toggleTimer}
            reset={resetTimer}
            duration={duration}
            minutes={minutes}
            seconds={seconds}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Mood ve kontroller */}
        <motion.div
          variants={itemVariants}
          className="bg-black/10 backdrop-blur-md p-4 md:p-6 rounded-lg space-y-4">
          <MoodSelector
            moods={moods}
            onMoodChange={handleMoodChange}
            activeUrl={currentStreamUrl}
            isVideoEnabled={isVideoEnabled}
            onVideoToggle={() => setIsVideoEnabled(true)}
          />
          <VolumeControl volume={volume} onVolumeChange={setVolume} />
          <Player
            isActive={isActive}
            streamUrl={currentStreamUrl}
            volume={volume}
          />
        </motion.div>

        {/* Todo listesi - lazy loaded */}
        <motion.div variants={itemVariants}>
          <Suspense fallback={<LoadingSpinner size="sm" />}>
            <TodoList />
          </Suspense>
        </motion.div>
      </motion.div>

      {/* Settings modal - lazy loaded */}
      {isSettingsOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <SettingsModal
            onClose={() => setIsSettingsOpen(false)}
            duration={duration}
            onDurationChange={handleDurationChange}
          />
        </Suspense>
      )}
    </main>
  );
}
