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
  const re = new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i')
  const m = html.match(re)
  return m?.[1] ?? null
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
    const image = pickMeta(html, 'og:image')
    const w = Number(pickMeta(html, 'og:image:width') || '') || undefined
    const h = Number(pickMeta(html, 'og:image:height') || '') || undefined
    if (image) {
      const data: Poster = { poster: image, width: w, height: h, permalink }
      return NextResponse.json(data)
    }
  }

  return NextResponse.json({ error: 'no_poster' }, { status: 422 })
}

