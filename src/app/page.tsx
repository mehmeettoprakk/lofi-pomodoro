"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Timer from "@/components/Timer";
import Player from "@/components/Player";
import MoodSelector from "@/components/MoodSelector";
import { Settings } from "lucide-react";
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
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  // New state for features
  const [volume, setVolume] = useState(0.5); // Volume from 0 to 1
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleMoodChange = (url: string) => {
    setCurrentStreamUrl(url);
    const selectedMood = moods.find((mood) => mood.url === url);
    if (selectedMood) {
      setCurrentVideoMode(selectedMood.videoMode);
    }
  };

  // Duration değiştiğinde hook'u güncelle
  const handleDurationChange = (newDuration: number) => {
    updateDuration(newDuration);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <BackgroundVideo
        mode={currentVideoMode}
        isEnabled={isVideoEnabled}
        onToggle={() => setIsVideoEnabled((prev) => !prev)}
      />

      {/* Ana container - tek sütun */}
      <div className="w-full max-w-lg mx-auto space-y-8">
        {/* Üst kısım - Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Pomodoro Focus</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-white/70 hover:text-white transition-colors">
              <Settings size={24} />
            </button>
          </div>
        </motion.div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}>
          <TodoList />
        </motion.div>
      </div>

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
