"use client"

import { useEffect, useMemo, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Play } from "lucide-react"

type Props = { urls?: string[] }

export function InstagramGrid({ urls }: Props) {
  const [resolvedUrls, setResolvedUrls] = useState<string[] | null>(urls ?? null)
  const [openUrl, setOpenUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(!urls)

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

  const toEmbed = (url: string) => {
    try {
      const u = new URL(url)
      // ensure trailing slash before embed
      if (!u.pathname.endsWith('/')) u.pathname += '/'
      return `${u.origin}${u.pathname}embed`
    } catch {
      return url.endsWith('/') ? `${url}embed` : `${url}/embed`
    }
  }

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
        {resolvedUrls.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenUrl(url)}
            className="overflow-hidden rounded-md border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Play Instagram reel"
          >
            <AspectRatio ratio={1}>
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white shadow-sm backdrop-blur">
                  <Play className="h-5 w-5" />
                </div>
              </div>
            </AspectRatio>
          </button>
        ))}
      </div>
      <Dialog open={Boolean(openUrl)} onOpenChange={(o) => !o && setOpenUrl(null)}>
        <DialogContent className="max-w-[min(92vw,560px)] p-0">
          {openUrl && (
            <div className="relative">
              <AspectRatio ratio={ratioFor(openUrl)}>
                <iframe
                  src={toEmbed(openUrl)}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full rounded-md"
                />
              </AspectRatio>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
