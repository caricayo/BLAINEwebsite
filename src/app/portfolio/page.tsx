"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
// Removed Popover/Command imports since PlacementCombobox is currently unused
import { Skeleton } from "@/components/ui/skeleton"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import type { PortfolioItem, StyleTag, PlacementTag } from "@/types"
import portfolioData from "../../../data/portfolio.json"

type Style = "all" | StyleTag
type Placement = "all" | PlacementTag

const STYLE_OPTIONS: { value: Style; label: string }[] = [
  { value: "all", label: "All" },
  { value: "black-gray", label: "Black & gray" },
  { value: "color", label: "Color" },
  { value: "fine-line", label: "Fine line" },
  { value: "realism", label: "Realism" },
  { value: "script", label: "Script" },
  { value: "geometric", label: "Geometric" },
  { value: "tribal", label: "Tribal" },
  { value: "anime", label: "Anime" },
]

const PLACEMENT_OPTIONS: { value: Placement; label: string }[] = [
  { value: "all", label: "All placements" },
  { value: "arm", label: "Arm" },
  { value: "forearm", label: "Forearm" },
  { value: "wrist", label: "Wrist" },
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulder", label: "Shoulder" },
  { value: "calf", label: "Calf" },
  { value: "thigh", label: "Thigh" },
]

const ITEMS: PortfolioItem[] = (portfolioData as PortfolioItem[])

export default function PortfolioPage() {
  const [style, setStyle] = useState<Style>("all")
  const [placement, setPlacement] = useState<Placement>("all")
  const [openImage, setOpenImage] = useState<{ src: string; alt: string } | null>(null)
  const [logs, setLogs] = useState<MediaLogEntry[]>([])
  const [showLog, setShowLog] = useState(false)

  const filtered = useMemo(() => {
    const list = ITEMS.filter((i) =>
      (style === "all" || i.styles.includes(style)) && (placement === "all" || i.placements.includes(placement))
    )
    return [...list].sort((a, b) => {
      const ad = a.date ? new Date(a.date).getTime() : 0
      const bd = b.date ? new Date(b.date).getTime() : 0
      return bd - ad
    })
  }, [style, placement])

  const addLog = (entry: MediaLogEntry) => {
    setLogs((prev) => [{ ...entry, time: Date.now() }, ...prev].slice(0, 200))
  }

  return (
    <MediaLogContext.Provider value={{ addLog }}>
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-10">
      {/* Aftercare banner */}
      <section className="mb-6 rounded-lg border bg-muted/40 p-4 sm:mb-8 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-medium">Aftercare highlights</h2>
          <p className="text-sm text-foreground/70">Healed results start with great aftercare. Read the essentials.</p>
        </div>
        <Button asChild className="mt-3 sm:mt-0">
          <Link href="/aftercare">View Aftercare</Link>
        </Button>
      </section>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={style}
          onValueChange={(v) => setStyle(v as Style)}
          className="w-full sm:w-auto"
        >
          <TabsList className="flex w-full flex-nowrap overflow-x-auto justify-start gap-1">
            {STYLE_OPTIONS.map((opt) => (
              <TabsTrigger key={opt.value} value={opt.value} className="whitespace-nowrap text-xs sm:text-sm">
                {opt.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Placement filter hidden for now */}

        {(style !== "all" || placement !== "all") && (
          <Button variant="outline" onClick={() => { setStyle("all"); setPlacement("all") }}>
            Clear filters
          </Button>
        )}
      </div>

      {logs.length > 0 && (
        <div className="mb-4 rounded-md border bg-muted/30 p-3 text-xs">
          <div className="flex items-center justify-between">
            <div>Media load log · {logs.length} entries</div>
            <button className="underline hover:no-underline" onClick={() => setShowLog((s) => !s)} aria-expanded={showLog}>
              {showLog ? "Hide" : "Show"}
            </button>
          </div>
          {showLog && (
            <ul className="mt-2 max-h-40 space-y-1 overflow-auto text-foreground/70">
              {logs.map((l, i) => (
                <li key={i}>[{new Date(l.time!).toLocaleTimeString()}] {l.type} · {l.src} {l.status ? `(status ${l.status})` : ""} {l.error ? `- ${l.error}` : ""}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Grid */}
      <section aria-labelledby="portfolio-grid-heading">
        <h2 id="portfolio-grid-heading" className="sr-only">Portfolio grid</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {filtered.map((item) => (
            <div key={item.id} data-reveal>
              <Tile item={item} onOpenImage={(i) => setOpenImage(i)} />
            </div>
          ))}
        </div>
      </section>

      

      {/* Image dialog */}
      <Dialog open={Boolean(openImage)} onOpenChange={(o) => !o && setOpenImage(null)}>
        <DialogContent className="max-w-[90vw] p-0">
          {openImage && (
            <div className="flex max-h-[85vh] w-full items-center justify-center bg-black/80 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={openImage.src}
                alt={openImage.alt}
                className="max-h-[80vh] max-w-full rounded-md object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </MediaLogContext.Provider>
  )
}

// PlacementCombobox was unused; removed to satisfy linting and keep bundle lean

type MediaLogEntry = { type: 'video'; src: string; status?: number; error?: string; time?: number }
const MediaLogContext = createContext<{ addLog: (e: MediaLogEntry) => void } | null>(null)

function Tile({ item, onOpenImage }: { item: PortfolioItem; onOpenImage: (img: { src: string; alt: string }) => void }) {
  const [loaded, setLoaded] = useState(false)
  const [poster] = useState<string | null>(item.src ?? null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [inView, setInView] = useState(false)
  const [muted, setMuted] = useState(true)
  const [controls, setControls] = useState(false)
  const tileRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const isVideo = Boolean(item.videoSrc)
  const logCtx = useContext(MediaLogContext)

  // Observe visibility to defer any network work until the tile is near viewport
  useEffect(() => {
    if (!tileRef.current || inView) return
    const el = tileRef.current
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (e?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView])

  // No poster probing when not provided; we will show a lightweight inline video preview when in view.

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(!!mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  return (
    <div ref={tileRef} className="group relative overflow-hidden rounded-md border bg-card">
      <AspectRatio ratio={4 / 5}>
        {!loaded && <Skeleton className="pointer-events-none absolute inset-0 h-full w-full" />}
        {isVideo ? (
          <>
            {inView ? (
              <video
                ref={videoRef}
                src={item.videoSrc as string}
                muted={muted}
                playsInline
                loop={!reduceMotion}
                autoPlay={!reduceMotion}
                preload="metadata"
                poster={poster ?? undefined}
                controls={controls}
                onLoadedMetadata={() => setLoaded(true)}
                onError={() => logCtx?.addLog({ type: 'video', src: item.videoSrc as string, error: 'tile preview failed' })}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className={`h-full w-full bg-muted ${loaded ? 'opacity-100' : 'opacity-0'}`} />
            )}
            {!controls && (
              <button
                type="button"
                className="absolute inset-0"
                onClick={async () => {
                  if (!videoRef.current) return
                  try {
                    videoRef.current.muted = false
                    setMuted(false)
                    videoRef.current.controls = true
                    setControls(true)
                    await videoRef.current.play()
                  } catch {}
                }}
                aria-label={`${item.alt} (unmute video)`}
              >
                <span className="sr-only">Unmute</span>
              </button>
            )}
            {muted && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white shadow-sm backdrop-blur group-hover:scale-105">
                  <Play className="h-5 w-5" />
                </div>
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => item.src && onOpenImage({ src: item.src, alt: item.alt })}
            aria-label={`${item.alt} (open image)`}
          >
            <Image
              src={item.src as string}
              alt={item.alt}
              fill
              sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
              className={`object-cover transition duration-300 ease-out group-hover:scale-[1.02] ${loaded ? 'opacity-100' : 'opacity-0'}`}
              onLoadingComplete={() => setLoaded(true)}
            />
          </button>
        )}
      </AspectRatio>
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_hsl(var(--color-border))]" />
      <span className="sr-only">{item.alt}</span>
    </div>
  )
}






