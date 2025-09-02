"use client"

import { useEffect, useMemo, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Play } from "lucide-react"
import { InlineVideo } from "@/components/inline-video"

type Props = { urls?: string[] }

export function InstagramGrid({ urls }: Props) {
  const [resolvedUrls, setResolvedUrls] = useState<string[] | null>(urls ?? null)
  const [openItem, setOpenItem] = useState<{ url: string; kind: 'video' | 'image'; poster: string; src?: string } | null>(null)
  const [loading, setLoading] = useState<boolean>(!urls)
  const [meta, setMeta] = useState<Record<string, { kind: 'video' | 'image'; poster: string; src?: string }>>({})

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (resolvedUrls) return
      try {
        const r = await fetch(`/api/ig/media?limit=36`, { cache: 'no-store' })
        const data = (await r.json().catch(() => ({}))) as { urls?: string[] }
        const list = Array.isArray(data.urls) ? data.urls : []
        if (mounted) {
          setResolvedUrls(list)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [resolvedUrls])

  const count = useMemo(() => resolvedUrls?.length ?? 12, [resolvedUrls])

  // Resolve posters and (when available) direct video URLs
  useEffect(() => {
    if (!resolvedUrls?.length) return
    let canceled = false
    ;(async () => {
      const entries = await Promise.all(
        resolvedUrls.map(async (u) => {
          try {
            const r = await fetch(`/api/ig/resolve?url=${encodeURIComponent(u)}`, { cache: 'no-store' })
            const j = await r.json()
            if (j && (j.poster || j.src)) {
              return [u, { kind: j.kind as 'video' | 'image', poster: j.poster as string, src: j.src as string | undefined }] as const
            }
          } catch {}
          return [u, null] as const
        })
      )
      if (!canceled) {
        const next: Record<string, { kind: 'video' | 'image'; poster: string; src?: string }> = {}
        for (const [u, v] of entries) if (v) next[u] = v
        setMeta(next)
      }
    })()
    return () => {
      canceled = true
    }
  }, [resolvedUrls])

  // no-op: previous embed approach replaced by local playback via resolver/proxy

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" data-reveal>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    )
  }

  if (!resolvedUrls?.length) {
    return (
      <div className="text-sm text-foreground/70" data-reveal>
        No posts yet. Follow us on Instagram for the latest work.
      </div>
    )
  }

  const ratioFor = (u: string) => (u.includes('/reel/') || u.includes('/tv/')) ? (9 / 16) : 1

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" data-reveal>
        {resolvedUrls.map((url, i) => {
          const m = meta[url]
          return (
            <button
              key={i}
              type="button"
              onClick={() => m && setOpenItem({ url, kind: m.kind, poster: m.poster, src: m.src })}
              className="overflow-hidden rounded-md border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open Instagram media"
            >
              <AspectRatio ratio={ratioFor(url)}>
                {m ? (
                  m.kind === 'video' ? (
                    <div className="relative h-full w-full">
                      <img src={m.poster} alt="Instagram preview" className="h-full w-full object-cover" />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white shadow-sm backdrop-blur">
                          <Play className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img src={m.poster} alt="Instagram image" className="h-full w-full object-cover" />
                  )
                ) : (
                  <Skeleton className="h-full w-full" />
                )}
              </AspectRatio>
            </button>
          )
        })}
      </div>
      <Dialog open={Boolean(openItem)} onOpenChange={(o) => !o && setOpenItem(null)}>
        <DialogContent className="max-w-[min(92vw,560px)] p-0">
          {openItem && (
            <div className="relative">
              <AspectRatio ratio={ratioFor(openItem.url)}>
                {openItem.kind === 'video' && openItem.src ? (
                  <InlineVideo src={`/api/ig/stream?src=${encodeURIComponent(openItem.src)}`} alt="Instagram video" />
                ) : (
                  <img src={openItem.poster} alt="Instagram image" className="h-full w-full object-cover" />
                )}
              </AspectRatio>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
