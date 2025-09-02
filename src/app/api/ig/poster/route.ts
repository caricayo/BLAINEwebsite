import { NextResponse } from "next/server"

type Poster = {
  poster: string
  width?: number
  height?: number
  permalink: string
}

function normalizePermalink(input: string): string | null {
  try {
    const u = new URL(input)
    const parts = u.pathname.split('/').filter(Boolean)
    if (parts.length >= 2 && ['p','reel','tv'].includes(parts[0])) {
      return `https://www.instagram.com/${parts[0]}/${parts[1]}/`
    }
    return null
  } catch {
    return null
  }
}

function pickMeta(html: string, name: string): string | null {
  // match either property or name attributes
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')
  const m = html.match(re)
  return m?.[1] ?? null
}

function pickAnyMeta(html: string, names: string[]): string | null {
  for (const n of names) {
    const v = pickMeta(html, n)
    if (v) return v
  }
  return null
}

function pickJsonThumbnail(html: string): string | null {
  // Try to find JSON-LD blocks with a thumbnail URL
  const scripts = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  if (!scripts) return null
  for (const s of scripts) {
    const m = s.match(/<script[^>]*>([\s\S]*?)<\/script>/i)
    const body = m?.[1]
    if (!body) continue
    try {
      const json = JSON.parse(body)
      const thumb = json?.thumbnailUrl || json?.thumbnail_url || (Array.isArray(json) && (json[0]?.thumbnailUrl || json[0]?.thumbnail_url))
      if (typeof thumb === 'string') return thumb
      if (Array.isArray(thumb) && typeof thumb[0] === 'string') return thumb[0]
    } catch {}
  }
  return null
}

async function fetchOEmbed(permalink: string): Promise<string | null> {
  try {
    const o = new URL('https://www.instagram.com/api/v1/oembed/')
    o.searchParams.set('url', permalink)
    const r = await fetch(o, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.instagram.com/',
      },
      cache: 'no-store',
    })
    if (!r.ok) return null
    const j = await r.json().catch(() => null) as { thumbnail_url?: string } | null
    return (j?.thumbnail_url && typeof j.thumbnail_url === 'string') ? j.thumbnail_url : null
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

  const permalink = normalizePermalink(url)
  if (!permalink) return NextResponse.json({ error: 'bad_url' }, { status: 400 })

  // Try embed, then canonical, then mobile embed
  const candidates = [
    `${permalink}embed/`,
    permalink,
    `${permalink}`.replace('www.instagram.com', 'm.instagram.com') + 'embed/',
  ]

  for (const u of candidates) {
    const html = await fetchHtml(u)
    if (!html) continue
    const image =
      pickAnyMeta(html, ['og:image:secure_url', 'og:image', 'twitter:image']) ||
      pickJsonThumbnail(html)
    const w = Number(pickAnyMeta(html, ['og:image:width', 'twitter:image:width']) || '') || undefined
    const h = Number(pickAnyMeta(html, ['og:image:height', 'twitter:image:height']) || '') || undefined
    if (image) {
      const data: Poster = { poster: image, width: w, height: h, permalink }
      return NextResponse.json(data)
    }
  }

  // Final fallback: try oEmbed thumbnail
  const thumb = await fetchOEmbed(permalink)
  if (thumb) {
    const data: Poster = { poster: thumb, permalink }
    return NextResponse.json(data)
  }

  return NextResponse.json({ error: 'no_poster' }, { status: 422 })
}
