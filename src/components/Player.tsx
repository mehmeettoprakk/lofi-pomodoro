"use client";

import { useRef, useEffect, useState } from "react";

interface PlayerProps {
  isActive: boolean;
  streamUrl: string;
  volume: number;
}

const Player = ({ isActive, streamUrl, volume }: PlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Kullanıcı etkileşimini yakala
  useEffect(() => {
    const handleUserInteraction = () => {
      setIsUserInteracted(true);
      setAudioError(null);
    };

    // Sayfa genelinde click, touch veya keydown olaylarını dinle
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  // Audio element'i yönet
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    // Source'u güncelle
    if (audioElement.src !== streamUrl) {
      audioElement.src = streamUrl;
      audioElement.load();
    }

    // Volume'u ayarla
    audioElement.volume = volume;

    // Play/pause mantığı - sadece kullanıcı etkileşimi varsa
    if (isActive && isUserInteracted) {
      const playPromise = audioElement.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioError(null);
          })
          .catch((error) => {
            console.warn("Ses çalınamadı:", error.message);
            setAudioError("Ses çalınamadı. Sayfa ile etkileşime geçin.");
          });
      }
    } else if (!isActive) {
      audioElement.pause();
    }
  }, [isActive, streamUrl, volume, isUserInteracted]);

  return (
    <div className="mt-4">
      <audio ref={audioRef} loop preload="metadata">
        Tarayıcınız ses öğesini desteklemiyor.
      </audio>

      {/* Kullanıcı etkileşimi gereksinimi uyarısı */}
      {isActive && !isUserInteracted && (
        <div className="text-xs text-yellow-300 text-center mt-2 p-2 bg-yellow-500/20 rounded">
          🔊 Ses için sayfaya tıklayın
        </div>
      )}

      {/* Ses hatası uyarısı */}
      {audioError && (
        <div className="text-xs text-red-300 text-center mt-2 p-2 bg-red-500/20 rounded">
          {audioError}
        </div>
      )}

      {/* Ses durumu göstergesi */}
      {isActive && isUserInteracted && !audioError && (
        <div className="text-xs text-green-300 text-center mt-2">
          🎵 Müzik çalıyor
        </div>
      )}
    </div>
  );
};

export default Player;
