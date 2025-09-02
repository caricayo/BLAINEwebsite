"use client"

import { useRef, useState } from "react"

type InlineVideoProps = {
  src: string
  alt?: string
  className?: string
}

export function InlineVideo({ src, alt, className }: InlineVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [muted, setMuted] = useState(true)
  const [controls, setControls] = useState(false)

  const unmuteAndPlay = async () => {
    if (!videoRef.current) return
    try {
      videoRef.current.muted = false
      setMuted(false)
      videoRef.current.controls = true
      setControls(true)
      await videoRef.current.play()
    } catch {}
  }

  return (
    <div className={`absolute inset-0 ${className ?? ""}`}>
      <video
        ref={videoRef}
        src={src}
        muted={muted}
        playsInline
        loop
        autoPlay
        preload="metadata"
        controls={controls}
        aria-label={alt}
        className="h-full w-full object-cover"
      />

      {!controls && (
        <button
          type="button"
          className="absolute inset-0"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            unmuteAndPlay()
          }}
          aria-label={alt ? `${alt} (unmute video)` : "Unmute video"}
        />
      )}
    </div>
  )
}
