"use client";

import { useRef, useEffect } from "react";

interface PlayerProps {
  isActive: boolean;
  streamUrl: string;
  volume: number;
}

const Player = ({ isActive, streamUrl, volume }: PlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // A single, robust effect to manage the audio element's state.
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    // Set the source programmatically to avoid race conditions.
    // We only update if it's different to avoid re-loading the same track on simple play/pause.
    if (audioElement.src !== streamUrl) {
      audioElement.src = streamUrl;
      audioElement.load(); // Explicitly tell the browser to load the new source.
    }

    // Set the volume
    audioElement.volume = volume;

    // Handle the play/pause logic.
    if (isActive) {
      // The play() method returns a Promise. We should handle its potential rejection.
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }
    } else {
      audioElement.pause();
    }
  }, [isActive, streamUrl, volume]); // Re-run this logic whenever the state, URL or volume changes.

  return (
    <div className="mt-8">
      {/* The src is not set here initially; the useEffect has full control. */}
      <audio ref={audioRef} loop>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Player;
