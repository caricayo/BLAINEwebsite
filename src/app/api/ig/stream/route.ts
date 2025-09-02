import { NextResponse } from "next/server"

const ALLOWED_HOSTS = [
  /\.cdninstagram\.com$/i,
  /\.fbcdn\.net$/i,
]

function isAllowed(urlStr: string): boolean {
  try {
    const u = new URL(urlStr)
    return ALLOWED_HOSTS.some((re) => re.test(u.hostname)) && (u.protocol === 'https:')
  } catch {
    return false
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const src = searchParams.get('src')
  if (!src || !isAllowed(src)) return NextResponse.json({ error: 'invalid_src' }, { status: 400 })

  const range = (req.headers.get('range') || '').toString()
  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.instagram.com/',
  }
  if (range) headers['Range'] = range

  const upstream = await fetch(src, { headers })

  const passthroughHeaders = new Headers()
  const copy = (key: string) => {
    const v = upstream.headers.get(key)
    if (v) passthroughHeaders.set(key, v)
  }
  copy('content-type')
  copy('content-length')
  copy('accept-ranges')
  copy('content-range')
  copy('cache-control')

  return new Response(upstream.body, {
    status: upstream.status,
    headers: passthroughHeaders,
  })
}
