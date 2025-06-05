"use client";

import { Volume1, Volume2, VolumeX } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center justify-center gap-3 w-full max-w-sm mx-auto mt-4">
      <VolumeIcon className="text-white/70" />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
      />
    </div>
  );
};

export default VolumeControl;
