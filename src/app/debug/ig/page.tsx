"use client"

import { useState } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { InlineVideo } from "@/components/inline-video"

export default function DebugIG() {
  const [url, setUrl] = useState("")
  const [data, setData] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  const run = async () => {
    setErr(null)
    setData(null)
    try {
      const r = await fetch(`/api/ig/resolve?url=${encodeURIComponent(url)}`)
      const j = await r.json()
      if (!r.ok) throw new Error(j?.error || r.statusText)
      setData(j)
    } catch (e: any) {
      setErr(e?.message || 'error')
    }
  }

  const ratioFor = (u: string) => (u.includes('/reel/') || u.includes('/tv/')) ? (9/16) : 1

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-xl font-semibold mb-3">IG Debug</h1>
      <div className="flex gap-2 mb-4">
        <input className="w-full rounded border px-2 py-1" placeholder="Instagram URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button className="rounded border px-3" onClick={run}>Resolve</button>
      </div>
      {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
      {data && (
        <div className="space-y-3">
          <pre className="text-xs bg-muted p-2 rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          <AspectRatio ratio={ratioFor(url)}>
            {data.kind === 'video' && data.src ? (
              <InlineVideo src={`/api/ig/stream?src=${encodeURIComponent(data.src)}`} alt="debug video" />
            ) : (
              <img src={data.poster} alt="debug poster" className="h-full w-full object-cover" />
            )}
          </AspectRatio>
        </div>
      )}
    </div>
  )
}

