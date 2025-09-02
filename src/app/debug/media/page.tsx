"use client"

import portfolioRaw from "../../../../data/portfolio.json"
import { useEffect } from "react"
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
