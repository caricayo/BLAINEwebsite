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

function normalizePermalink(input: string): string | null {
  try {
    const u = new URL(input)
    const parts = u.pathname.split('/').filter(Boolean)
    // Accept /p/{id}, /reel/{id}, /tv/{id}
    if (parts.length >= 2 && ['p','reel','tv'].includes(parts[0])) {
      const origin = 'https://www.instagram.com'
      const path = `/${parts[0]}/${parts[1]}/`
      return origin + path
    }
    return null
  } catch {
    return null
  }
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.instagram.com/',
      },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'missing url' }, { status: 400 })

  try {
    const normalized = normalizePermalink(url)
    if (!normalized) return NextResponse.json({ error: 'bad_url' }, { status: 400 })

    // Try embed first (often exposes OG tags more reliably)
    const embedUrl = normalized.endsWith('/') ? `${normalized}embed/` : `${normalized}embed/`
    let html = await fetchHtml(embedUrl)
    if (!html) {
      html = await fetchHtml(normalized)
    }

    // Prefer secure video URL if present
    const video = html ? (pickMeta(html, 'og:video:secure_url') || pickMeta(html, 'og:video')) : null
    const image = html ? pickMeta(html, 'og:image') : null
    const w = html ? (Number(pickMeta(html, 'og:video:width') || pickMeta(html, 'og:image:width') || '') || undefined) : undefined
    const h = html ? (Number(pickMeta(html, 'og:video:height') || pickMeta(html, 'og:image:height') || '') || undefined) : undefined

    if (!video && !image) {
      // Last attempt: try mobile embed
      const mUrl = embedUrl.replace('www.instagram.com', 'm.instagram.com')
      const mHtml = await fetchHtml(mUrl)
      const mVideo = mHtml ? (pickMeta(mHtml, 'og:video:secure_url') || pickMeta(mHtml, 'og:video')) : null
      const mImage = mHtml ? pickMeta(mHtml, 'og:image') : null
      if (!mVideo && !mImage) {
        return NextResponse.json({ error: 'no_meta' }, { status: 422 })
      }
      const data: Resolved = mVideo ? { kind: 'video', poster: mImage || '', src: mVideo, width: w, height: h } : { kind: 'image', poster: mImage!, width: w, height: h }
      return NextResponse.json(data)
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
