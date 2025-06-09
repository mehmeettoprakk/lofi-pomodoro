"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Timer from "@/components/Timer";
import Player from "@/components/Player";
import MoodSelector from "@/components/MoodSelector";
import { Settings, Video, VideoOff } from "lucide-react";
import SettingsModal from "@/components/SettingsModal";
import VolumeControl from "@/components/VolumeControl";
import BackgroundVideo from "@/components/BackgroundVideo";
import TodoList from "@/components/TodoList";
import { usePomodoro } from "@/hooks/usePomodoro";

// Updating the moods with video modes
const moods = [
  {
    name: "Ocean Waves",
    url: "https://soundbible.com/grab.php?id=1936&type=mp3",
    videoMode: "waves" as const,
  },
  {
    name: "Rainy Day",
    url: "https://www.soundjay.com/nature/sounds/rain-07.mp3",
    videoMode: "rain" as const,
  },
  {
    name: "Fireplace",
    url: "https://soundbible.com/grab.php?id=1543&type=mp3",
    videoMode: "fireplace" as const,
  },
];

// Mobil cihaz kontrolü
const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

// Optimized animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: isMobile ? 0.3 : 0.5,
      staggerChildren: isMobile ? 0.1 : 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: isMobile ? 10 : 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: isMobile ? 0.3 : 0.5 },
  },
};

export default function Home() {
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
  const [isVideoEnabled, setIsVideoEnabled] = useState(!isMobile); // Mobilde varsayılan kapalı

  // New state for features
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
      <BackgroundVideo
        mode={currentVideoMode}
        isEnabled={isVideoEnabled}
        onToggle={() => setIsVideoEnabled((prev) => !prev)}
      />

      {/* Ana container - tek sütun */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg mx-auto space-y-8">
        {/* Üst kısım - Header */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Pomodoro Focus</h1>
          <div className="flex items-center space-x-2">
            {/* Mobilde video toggle butonu */}
            {isMobile && (
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
              className="text-white/70 hover:text-white transition-colors">
              <Settings size={24} />
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
          className="bg-black/10 backdrop-blur-md p-6 rounded-lg space-y-4">
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

        {/* Todo listesi */}
        <motion.div variants={itemVariants}>
          <TodoList />
        </motion.div>
      </motion.div>

      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          duration={duration}
          onDurationChange={handleDurationChange}
        />
      )}
    </main>
  );
}
