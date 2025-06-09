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
  const [currentVolume, setCurrentVolume] = useState(volume);

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

  // Volume değişikliklerini ayrı effect'te yönet
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    // Volume'u güncelle
    audioElement.volume = volume;
    setCurrentVolume(volume);

    // Mobilde muted özelliğini de kontrol et
    if (volume === 0) {
      audioElement.muted = true;
    } else {
      audioElement.muted = false;
    }
  }, [volume]);

  // Audio source ve play/pause kontrolü
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    // Source'u güncelle - sadece farklı ise
    const currentSrc = audioElement.src;
    if (!currentSrc.includes(streamUrl.split("/").pop() || "")) {
      audioElement.src = streamUrl;
      audioElement.load();
    }

    // Play/pause mantığı
    const handlePlayback = async () => {
      if (isActive && isUserInteracted) {
        try {
          // Volume'u tekrar ayarla (mobil uyumluluk için)
          audioElement.volume = currentVolume;
          audioElement.muted = currentVolume === 0;

          if (audioElement.paused) {
            await audioElement.play();
            setAudioError(null);
          }
        } catch {
          // Hata durumunda sessizce devam et
          setAudioError("Ses çalınamadı. Sayfa ile etkileşime geçin.");
        }
      } else if (!isActive) {
        if (!audioElement.paused) {
          audioElement.pause();
        }
      }
    };

    handlePlayback();
  }, [isActive, streamUrl, isUserInteracted, currentVolume]);

  // Audio element load eventi
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleLoadedData = () => {
      // Audio yüklendiğinde volume'u ayarla
      audioElement.volume = currentVolume;
      audioElement.muted = currentVolume === 0;
    };

    audioElement.addEventListener("loadeddata", handleLoadedData);

    return () => {
      audioElement.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [currentVolume]);

  return (
    <div className="mt-4">
      <audio
        ref={audioRef}
        loop
        preload="metadata"
        playsInline
        controls={false}>
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
          {currentVolume === 0 ? "🔇 Sessiz" : "🎵 Müzik çalıyor"}
        </div>
      )}
    </div>
  );
};

export default Player;
