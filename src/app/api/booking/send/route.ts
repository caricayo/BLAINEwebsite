import { NextResponse } from "next/server"

type BookingPayload = {
  style: string
  colorMode: string
  placement?: string
  size?: string
  date?: string // ISO date
  timeWindow?: string
  name?: string
  email?: string
  phone?: string
}

export async function POST(req: Request) {
  try {
    const to = process.env.BOOKING_TO_EMAIL
    const apiKey = process.env.RESEND_API_KEY
    if (!to || !apiKey) {
      return new NextResponse(
        JSON.stringify({ error: "Missing BOOKING_TO_EMAIL or RESEND_API_KEY" }),
        { status: 500, headers: { "content-type": "application/json; charset=utf-8" } }
      )
    }

    const body = (await req.json()) as BookingPayload
    const fields = {
      style: body.style || "",
      colorMode: body.colorMode || "",
      placement: body.placement || "",
      size: body.size || "",
      date: body.date || "",
      timeWindow: body.timeWindow || "",
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
    }

    const subjectParts = ["New booking request"]
    if (fields.name) subjectParts.push(`— ${fields.name}`)
    if (fields.date) subjectParts.push(`— ${fields.date}`)
    const subject = subjectParts.join(" ")

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
        <h2 style="margin:0 0 12px">New booking request</h2>
        <p style="margin:0 0 12px">Below are the details submitted from the website.</p>
        <table style="border-collapse:collapse;min-width:360px">
          <tbody>
            <tr><td style="padding:4px 8px;font-weight:600">Name</td><td style="padding:4px 8px">${escapeHtml(fields.name)}</td></tr>
            <tr><td style="padding:4px 8px;font-weight:600">Email</td><td style="padding:4px 8px">${escapeHtml(fields.email)}</td></tr>
            <tr><td style="padding:4px 8px;font-weight:600">Phone</td><td style="padding:4px 8px">${escapeHtml(fields.phone)}</td></tr>
            <tr><td style="padding:4px 8px;font-weight:600">Style</td><td style="padding:4px 8px">${escapeHtml(fields.style)}</td></tr>
            <tr><td style="padding:4px 8px;font-weight:600">Color mode</td><td style="padding:4px 8px">${escapeHtml(fields.colorMode)}</td></tr>
            <tr><td style="padding:4px 8px;font-weight:600">Placement</td><td style="padding:4px 8px">${escapeHtml(fields.placement)}</td></tr>
            <tr><td style="padding:4px 8px;font-weight:600">Size</td><td style="padding:4px 8px">${escapeHtml(fields.size)}</td></tr>
            <tr><td style="padding:4px 8px;font-weight:600">Preferred date</td><td style="padding:4px 8px">${escapeHtml(fields.date)}</td></tr>
            <tr><td style="padding:4px 8px;font-weight:600">Time window</td><td style="padding:4px 8px">${escapeHtml(fields.timeWindow)}</td></tr>
          </tbody>
        </table>
      </div>
    `

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: "Tattoos by Blaine <onboarding@resend.dev>",
        to,
        subject,
        html,
        reply_to: fields.email || undefined,
      }),
    })

    return new NextResponse(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json; charset=utf-8" },
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "send_failed"
    return new NextResponse(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { "content-type": "application/json; charset=utf-8" } }
    )
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
