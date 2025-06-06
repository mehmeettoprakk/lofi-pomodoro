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
  const [isActive, setIsActive] = useState(false);
  const [currentStreamUrl, setCurrentStreamUrl] = useState(moods[0].url);
  const [currentVideoMode, setCurrentVideoMode] = useState<
    "waves" | "rain" | "fireplace"
  >(moods[0].videoMode);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  // New state for features
  const [volume, setVolume] = useState(0.5); // Volume from 0 to 1
  const [duration, setDuration] = useState(25); // Timer duration in minutes
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
  };

  const handleMoodChange = (url: string) => {
    setCurrentStreamUrl(url);
    const selectedMood = moods.find((mood) => mood.url === url);
    if (selectedMood) {
      setCurrentVideoMode(selectedMood.videoMode);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <BackgroundVideo
        mode={currentVideoMode}
        isEnabled={isVideoEnabled}
        onToggle={() => setIsVideoEnabled((prev) => !prev)}
      />
      <div className="w-full max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Pomodoro</h1>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-white/70 hover:text-white transition-colors">
            <Settings size={24} />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Timer
            isActive={isActive}
            toggle={toggleTimer}
            reset={resetTimer}
            duration={duration}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-black/10 backdrop-blur-md p-4 sm:p-6 rounded-lg space-y-4">
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

        {isSettingsOpen && (
          <SettingsModal
            onClose={() => setIsSettingsOpen(false)}
            duration={duration}
            onDurationChange={setDuration}
          />
        )}
      </div>
    </main>
  );
}
