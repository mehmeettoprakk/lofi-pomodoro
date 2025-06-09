import { useEffect, useRef, useState } from "react";
import { Video, VideoOff } from "lucide-react";

type VideoMode = "rain" | "waves" | "fireplace";

interface BackgroundVideoProps {
  mode: VideoMode;
  isEnabled: boolean;
  onToggle: () => void;
}

// Mobil cihaz kontrolü
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
};

const videoUrls = {
  rain: "/videos/rain.mp4",
  waves: "/videos/waves.mp4",
  fireplace: "/videos/fireplace.mp4",
};

export default function BackgroundVideo({
  mode,
  isEnabled,
  onToggle,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mobil kontrol
  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  // Video mode değişimi
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isEnabled) return;

    const newVideoUrl = videoUrls[mode];

    // Eğer aynı video ise bir şey yapma
    if (video.src.includes(newVideoUrl.split("/").pop() || "")) {
      return;
    }

    setIsLoading(true);

    // Smooth fade out
    video.style.opacity = "0.3";

    const changeVideo = async () => {
      try {
        // Video'yu duraklat
        if (!video.paused) {
          video.pause();
        }

        // Küçük gecikme
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Yeni video kaynağını ayarla
        video.src = newVideoUrl;
        video.currentTime = 0;

        // Video yüklendiğinde oynat
        const handleCanPlay = async () => {
          try {
            await video.play();
            // Fade in
            video.style.opacity = "1";
            setIsLoading(false);
          } catch (error) {
            console.warn("Video oynatma hatası:", error);
            setIsLoading(false);
          }
        };

        video.addEventListener("canplay", handleCanPlay, { once: true });
        video.load();
      } catch (error) {
        console.warn("Video değiştirme hatası:", error);
        video.style.opacity = "1";
        setIsLoading(false);
      }
    };

    changeVideo();
  }, [mode, isEnabled]);

  // İlk video yükleme
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isEnabled) return;

    // İlk kez video yükleniyorsa
    if (!video.src) {
      video.src = videoUrls[mode];

      const handleFirstLoad = async () => {
        try {
          await video.play();
          video.style.opacity = "1";
        } catch (error) {
          console.warn("İlk video yükleme hatası:", error);
        }
      };

      video.addEventListener("canplay", handleFirstLoad, { once: true });
      video.load();
    }
  }, [isEnabled, mode]);

  // Video enable/disable
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isEnabled) {
      if (video.paused && video.src) {
        video.play().catch(console.warn);
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [isEnabled]);

  // Mobilde video devre dışıysa sadece arka plan göster, buton yok
  if (isMobileDevice && !isEnabled) {
    return null;
  }

  return (
    <>
      {isEnabled && (
        <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10" />

          {/* Loading durumunda arka plan */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 transition-opacity duration-300" />
          )}

          {/* Ana video */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            loop
            muted
            playsInline
            preload={isMobileDevice ? "none" : "metadata"}
            style={{
              opacity: 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          />
        </div>
      )}

      <button
        onClick={onToggle}
        className={`fixed z-50 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-white border border-white/20 shadow-lg hover:scale-110 group ${
          isMobileDevice
            ? "bottom-20 right-4 p-2" // Mobilde küçük, TodoList'in üstünde
            : "bottom-6 right-6 p-3" // Desktop'ta normal boyut
        }`}
        title={
          isEnabled ? "Arka plan videosunu kapat" : "Arka plan videosunu aç"
        }>
        {isEnabled ? (
          <VideoOff
            className={`group-hover:text-red-400 transition-colors ${
              isMobileDevice ? "w-5 h-5" : "w-6 h-6"
            }`}
          />
        ) : (
          <Video
            className={`group-hover:text-green-400 transition-colors ${
              isMobileDevice ? "w-5 h-5" : "w-6 h-6"
            }`}
          />
        )}
      </button>
    </>
  );
}
