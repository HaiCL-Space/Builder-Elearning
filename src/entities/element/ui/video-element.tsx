import { type SlideElement, type VideoData } from "@broker/core-sdk"
import React from "react"
import { cn } from "@/shared/lib/utils"

interface VideoElementProps {
  element: Extract<SlideElement, { type: "VIDEO" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
}

const VideoElement: React.FC<VideoElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  const { 
    src, 
    poster, 
    autoPlay, 
    loop, 
    muted, 
    controls = true,
    isLive = false 
  } = element.data as VideoData

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const youtubeId = src ? getYoutubeId(src) : null
  
  // Detect if it's likely a live stream from URL
  const detectedLive = isLive || (src && (src.includes("live") || src.includes(".m3u8")))

  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: "#000",
        overflow: "hidden",
      }}
      onClick={handleClick}
      className="relative"
    >
      {youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${youtubeId}`}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : src ? (
        <video
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls}
          className="h-full w-full object-contain"
          playsInline
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white/50 text-xs flex-col gap-2">
          <span className="text-2xl">🎥</span>
          <span>Chưa cấu hình Video / Livestream</span>
        </div>
      )}

      {detectedLive && (
        <div className={cn(
          "absolute top-2 left-2 flex items-center gap-1.5 rounded-sm bg-red-600 px-1.5 py-0.5",
          "text-[10px] font-bold text-white shadow-lg animate-pulse z-10"
        )}>
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
          TRỰC TIẾP
        </div>
      )}
    </div>
  )
}

export default VideoElement
