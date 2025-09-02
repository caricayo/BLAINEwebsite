import { NextResponse } from "next/server"

type Resolved = {
  kind: 'video' | 'image'
  poster: string
  src?: string
  width?: number
  height?: number
}

function pickMeta(html: string, name: string): string | null {
  const re = new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')
  const m = html.match(re)
  return m?.[1] ?? null
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'missing url' }, { status: 400 })

  try {
    const res = await fetch(url, {
      // Instagram is picky; set a realistic UA and language.
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json({ error: 'fetch_failed', status: res.status }, { status: 502 })
    const html = await res.text()

    // Prefer secure video URL if present
    const video = pickMeta(html, 'og:video:secure_url') || pickMeta(html, 'og:video')
    const image = pickMeta(html, 'og:image')
    const w = Number(pickMeta(html, 'og:video:width') || pickMeta(html, 'og:image:width') || '') || undefined
    const h = Number(pickMeta(html, 'og:video:height') || pickMeta(html, 'og:image:height') || '') || undefined

    if (!video && !image) {
      return NextResponse.json({ error: 'no_meta' }, { status: 422 })
    }

    let data: Resolved
    if (video) {
      data = { kind: 'video', poster: image || '', src: video, width: w, height: h }
    } else {
      data = { kind: 'image', poster: image!, width: w, height: h }
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'exception' }, { status: 500 })
  }
}
