"use client"

import { Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { format, parseISO, addHours } from "date-fns"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function BookingConfirmedPage() {
  return (
    <Suspense fallback={<div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">Loading…</div>}>
      <Confirmed />
    </Suspense>
  )
}

function Confirmed() {
  const sp = useSearchParams()
  const name = sp.get("name") || ""
  const email = sp.get("email") || ""
  const amount = sp.get("amount") || ""
  const style = sp.get("style") || ""
  const placement = sp.get("placement") || ""
  const size = sp.get("size") || ""
  const timeWindow = sp.get("timeWindow") || ""
  const dateISO = sp.get("date") || ""

  const times = useMemo(() => {
    if (!dateISO) return null
    try {
      const start = parseISO(dateISO)
      const end = addHours(start, 2)
      return { start, end }
    } catch {
      return null
    }
  }, [dateISO])

  const downloadICS = () => {
    if (!times) return
    const dt = (d: Date) => format(d, "yyyyMMdd'T'HHmmss")
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Blaine Studio//Booking//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@blaine.studio`,
      `DTSTAMP:${dt(new Date())}`,
      `DTSTART:${dt(times.start)}`,
      `DTEND:${dt(times.end)}`,
      "SUMMARY:Tattoo Appointment — Blaine Studio",
      `DESCRIPTION:Style: ${style}; Placement: ${placement}; Size: ${size}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "blaine-appointment.ics"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <Card data-reveal>
        <CardHeader>
          <CardTitle>Booking confirmed</CardTitle>
          <CardDescription>
            Thank you{name ? `, ${name}` : ""}. We’ve recorded your deposit{amount ? ` of $${amount}` : ""}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <div className="font-medium">Contact</div>
            <div className="text-foreground/80">{[name, email].filter(Boolean).join(" • ") || "—"}</div>
          </div>
          <Separator />
          <div>
            <div className="font-medium">Design</div>
            <div className="text-foreground/80">{[style, placement, size].filter(Boolean).join(" • ") || "—"}</div>
          </div>
          <Separator />
          <div>
            <div className="font-medium">When</div>
            <div className="text-foreground/80">
              {times ? `${format(times.start, "PPP")} • ${timeWindow || ""}` : "—"}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-3">
          <Button onClick={downloadICS} disabled={!times}>Download .ics</Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/booking">Book another</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
