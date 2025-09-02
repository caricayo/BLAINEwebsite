"use client"

import portfolioRaw from "../../../../data/portfolio.json"
import React, { useEffect } from "react"
import type { PortfolioItem } from "@/types"

const portfolio = portfolioRaw as PortfolioItem[]

function log(event: string, id: string, src?: string) {
  console.log(`[debug-media] ${event}`, { id, src })
}

export default function DebugMediaPage() {
  useEffect(() => {
    log("page_mount", "debug_media")
  }, [])

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight">Debug: Media</h1>
      <p className="mb-6 text-sm text-foreground/70">
        Temporary diagnostic view. Renders raw videos/images with event logs. TODO: remove after verification.
      </p>
      <div className="mb-4 text-xs text-foreground/70">
        <a className="underline" href="/portfolio">Go to Portfolio</a>
      </div>
      <div className="space-y-6">
        {portfolio.map((item) => (
          <div key={item.id} className="rounded-md border">
            <div className="border-b bg-muted/40 px-3 py-2 text-sm">
              <span className="font-mono">{item.id}</span>
            </div>
            <div className="p-3 text-sm">
              {"videoSrc" in item && item.videoSrc ? (
                <div>
                  <div className="mb-2 text-xs text-foreground/70">
                    src: <a className="underline" href={item.videoSrc}>{item.videoSrc}</a>
                  </div>
                  <CheckHeaders path={item.videoSrc} />
                  <video
                    controls
                    preload="metadata"
                    onError={() => log("onerror", item.id, item.videoSrc)}
                    onLoadedMetadata={() => log("onloadedmetadata", item.id, item.videoSrc)}
                    onCanPlay={() => log("oncanplay", item.id, item.videoSrc)}
                    className="max-w-full rounded-md border"
                  >
                    <source src={item.videoSrc} />
                  </video>
                </div>
              ) : (
                <div>
                  <div className="mb-2 text-xs text-foreground/70">
                    src: <a className="underline" href={(item.src as string)}>{item.src}</a>
                  </div>
                  {item.src ? <CheckHeaders path={item.src} /> : null}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src as string} alt={item.alt || item.id} className="max-w-full rounded-md border" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CheckHeaders({ path }: { path: string }) {
  const [data, setData] = React.useState<{ status?: number; type?: string; ranges?: string; len?: string; error?: string } | null>(null)
  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const r = await fetch(`/api/debug/head?path=${encodeURIComponent(path)}`, { cache: 'no-store' })
        const j = await r.json()
        if (!mounted) return
        if (j.error) setData({ error: j.error })
        else setData({ status: j.status, type: j.headers?.["content-type"], ranges: j.headers?.["accept-ranges"], len: j.headers?.["content-length"] })
      } catch (e) {
        if (mounted) setData({ error: (e as Error).message })
      }
    })()
    return () => { mounted = false }
  }, [path])
  return (
    <div className="mb-2 text-xs">
      {data?.error ? (
        <span className="text-red-600">HEAD error: {data.error}</span>
      ) : data ? (
        <span>
          Status {data.status} · {data.type || 'unknown'} · ranges: {data.ranges || 'n/a'} · size: {data.len || 'n/a'}
        </span>
      ) : (
        <span className="text-foreground/60">checking headers…</span>
      )}
    </div>
  )
}
