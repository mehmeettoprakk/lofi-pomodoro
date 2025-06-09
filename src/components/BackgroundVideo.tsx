import { useEffect, useRef, useState } from "react";
import { Video, VideoOff } from "lucide-react";

type VideoMode = "rain" | "waves" | "fireplace";

interface BackgroundVideoProps {
  mode: VideoMode;
  isEnabled: boolean;
  onToggle: () => void;
}

// Cihaz performans tespiti
const getDeviceInfo = () => {
  if (typeof window === "undefined")
    return { isMobile: false, isLowEnd: false, isSafari: false };

  const isMobile =
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  // Düşük performanslı cihaz tespiti
  const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
  const isLowEnd =
    navigator.hardwareConcurrency <= 2 ||
    (deviceMemory && deviceMemory <= 2) ||
    /Android.*[4-6]\./i.test(navigator.userAgent) ||
    window.innerWidth < 480;

  return { isMobile, isLowEnd, isSafari };
};

// Optimize edilmiş video URL'leri - WebM formatı daha küçük
const videoUrls = {
  rain: "/videos/rain.mp4",
  waves: "/videos/waves.mp4",
  fireplace: "/videos/fireplace.mp4",
};

// Fallback gradient backgrounds düşük performanslı cihazlar için
const gradientBackgrounds = {
  rain: "bg-gradient-to-br from-gray-700 via-blue-800 to-gray-900",
  waves: "bg-gradient-to-br from-blue-600 via-cyan-700 to-blue-900",
  fireplace: "bg-gradient-to-br from-orange-600 via-red-700 to-yellow-800",
};

export default function BackgroundVideo({
  mode,
  isEnabled,
  onToggle,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isLowEnd: false,
    isSafari: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Device info'yu bir kez hesapla
  useEffect(() => {
    setDeviceInfo(getDeviceInfo());
  }, []);

  // Safari için kullanıcı etkileşimi dinle
  useEffect(() => {
    if (!deviceInfo.isSafari) return;

    const handleUserInteraction = () => setHasUserInteracted(true);

    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [deviceInfo.isSafari]);

  // Video yükleme ve mode değişimi
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isEnabled || deviceInfo.isLowEnd) return;

    const newVideoUrl = videoUrls[mode];

    // Aynı video ise skip
    if (video.src.includes(newVideoUrl.split("/").pop() || "")) {
      return;
    }

    setIsLoading(true);
    setVideoError(false);

    const loadVideo = async () => {
      try {
        // Fade out
        video.style.opacity = "0.3";

        if (!video.paused) video.pause();

        // Yeni video source
        video.src = newVideoUrl;
        video.currentTime = 0;

        const handleCanPlay = async () => {
          try {
            // Safari kontrolü
            if (deviceInfo.isSafari && !hasUserInteracted) {
              setIsLoading(false);
              video.style.opacity = "1";
              return;
            }

            await video.play();
            video.style.opacity = "1";
            setIsLoading(false);
          } catch {
            // Safari'de video hatası varsa sessizce devam et
            setVideoError(true);
            setIsLoading(false);
            video.style.opacity = "1";
          }
        };

        const handleError = () => {
          setVideoError(true);
          setIsLoading(false);
          video.style.opacity = "1";
        };

        video.addEventListener("canplay", handleCanPlay, { once: true });
        video.addEventListener("error", handleError, { once: true });

        video.load();
      } catch {
        setVideoError(true);
        setIsLoading(false);
        if (video) video.style.opacity = "1";
      }
    };

    loadVideo();
  }, [mode, isEnabled, deviceInfo, hasUserInteracted]);

  // Video enable/disable kontrolü
  useEffect(() => {
    const video = videoRef.current;
    if (!video || deviceInfo.isLowEnd) return;

    if (isEnabled && !videoError) {
      if (video.paused && video.src) {
        const playVideo = async () => {
          try {
            if (deviceInfo.isSafari && !hasUserInteracted) return;
            await video.play();
          } catch {
            setVideoError(true);
          }
        };
        playVideo();
      }
    } else {
      if (!video.paused) video.pause();
    }
  }, [isEnabled, deviceInfo, hasUserInteracted, videoError]);

  // Düşük performanslı cihazlarda sadece gradient background
  if (deviceInfo.isLowEnd) {
    return isEnabled ? (
      <div
        className={`fixed inset-0 -z-10 ${gradientBackgrounds[mode]} transition-all duration-1000`}>
        <div className="absolute inset-0 bg-black/20" />
      </div>
    ) : null;
  }

  // Mobilde video devre dışıysa hiçbir şey gösterme
  if (deviceInfo.isMobile && !isEnabled) {
    return null;
  }

  return (
    <>
      {isEnabled && (
        <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/30 z-10" />

          {/* Loading/Error durumunda fallback background */}
          {(isLoading || videoError) && (
            <div
              className={`absolute inset-0 ${gradientBackgrounds[mode]} transition-opacity duration-500`}
            />
          )}

          {/* Safari kullanıcı etkileşimi uyarısı */}
          {deviceInfo.isSafari && !hasUserInteracted && !videoError && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-4 rounded-lg text-center backdrop-blur-sm">
              <p className="text-sm">Video için sayfaya tıklayın</p>
            </div>
          )}

          {/* Ana video - hata yoksa göster */}
          {!videoError && (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              loop
              muted
              playsInline
              preload={deviceInfo.isMobile ? "none" : "metadata"}
              style={{
                opacity: 0,
                transition: "opacity 0.5s ease-in-out",
              }}
            />
          )}
        </div>
      )}

      {/* Desktop'ta video toggle butonu */}
      {!deviceInfo.isMobile && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-white border border-white/20 shadow-lg hover:scale-110 group"
          title={
            isEnabled ? "Arka plan videosunu kapat" : "Arka plan videosunu aç"
          }>
          {isEnabled ? (
            <VideoOff className="w-6 h-6 group-hover:text-red-400 transition-colors" />
          ) : (
            <Video className="w-6 h-6 group-hover:text-green-400 transition-colors" />
          )}
        </button>
      )}
    </>
  );
}
