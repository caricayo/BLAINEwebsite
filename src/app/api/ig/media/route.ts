import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const revalidate = 3600 // revalidate cached result every hour

async function fetchFromGraph(limit: number): Promise<string[] | null> {
  const userId = process.env.IG_USER_ID
  const token = process.env.IG_ACCESS_TOKEN
  if (!userId || !token) return null

  const url = new URL(`https://graph.facebook.com/v21.0/${userId}/media`)
  url.searchParams.set("fields", "permalink,media_type,thumbnail_url,caption")
  url.searchParams.set("limit", String(Math.min(limit, 50)))
  url.searchParams.set("access_token", token)

  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) return null
  const data = await res.json().catch(() => null) as { data?: Array<{ permalink?: string; media_type?: string }> } | null
  if (!data?.data) return null
  const urls = data.data
    .filter((i) => typeof i.permalink === "string")
    .map((i) => i.permalink as string)
  return urls.slice(0, limit)
}

async function fetchFromLocal(limit: number): Promise<string[]> {
  try {
    const mod = await import("../../../../../data/instagram.json")
    const all = (mod.default as unknown as string[]).filter((u) => typeof u === "string")
    return all.slice(0, limit)
  } catch {
    return []
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Math.max(1, Math.min(36, Number(searchParams.get("limit")) || 36))

  let urls: string[] | null = null
  try {
    urls = await fetchFromGraph(limit)
  } catch {
    urls = null
  }
  if (!urls || urls.length === 0) {
    urls = await fetchFromLocal(limit)
  }

  return NextResponse.json({ urls })
}
