"use client"

import { useEffect, useMemo, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AspectRatio } from "@/components/ui/aspect-ratio"

type Props = { urls?: string[] }

export function InstagramGrid({ urls }: Props) {
  const [resolvedUrls, setResolvedUrls] = useState<string[] | null>(urls ?? null)
  const [loading, setLoading] = useState<boolean>(!urls)
  const [posters, setPosters] = useState<Record<string, string>>({})

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

  // Resolve posters for each URL
  useEffect(() => {
    if (!resolvedUrls?.length) return
    let canceled = false
    ;(async () => {
      const entries = await Promise.all(
        resolvedUrls.map(async (u) => {
          try {
            const r = await fetch(`/api/ig/poster?url=${encodeURIComponent(u)}`, { cache: 'no-store' })
            if (!r.ok) return [u, null] as const
            const j = (await r.json()) as { poster?: string }
            return [u, j.poster ?? null] as const
          } catch {
            return [u, null] as const
          }
        })
      )
      if (!canceled) {
        const next: Record<string, string> = {}
        for (const [u, v] of entries) if (v) next[u] = v
        setPosters(next)
      }
    })()
    return () => { canceled = true }
  }, [resolvedUrls])

  // kept for compatibility; currently not used since we link out directly
  const toEmbed = (url: string) => url

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
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" data-reveal>
      {resolvedUrls.map((url, i) => (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="overflow-hidden rounded-md border bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open on Instagram"
        >
          <AspectRatio ratio={ratioFor(url)}>
            {posters[url] ? (
              <img src={posters[url]} alt="Instagram preview" className="h-full w-full object-cover" />
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </AspectRatio>
        </a>
      ))}
    </div>
  )
}
