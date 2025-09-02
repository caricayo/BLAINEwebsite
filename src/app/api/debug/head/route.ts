import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const path = searchParams.get("path") || ""
    if (!path.startsWith("/portfolio/")) {
      return NextResponse.json({ error: "path must start with /portfolio/" }, { status: 400 })
    }
    const target = new URL(path, new URL(req.url).origin).toString()
    const res = await fetch(target, { method: "HEAD", cache: "no-store" })
    const headers: Record<string, string | null> = {
      "content-type": res.headers.get("content-type"),
      "accept-ranges": res.headers.get("accept-ranges"),
      "content-length": res.headers.get("content-length"),
      "cache-control": res.headers.get("cache-control"),
    }
    return NextResponse.json({ url: target, status: res.status, headers })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

