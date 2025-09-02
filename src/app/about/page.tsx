import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Instagram, Mail, ShieldCheck, Syringe, CheckCircle2 } from "lucide-react"

export const metadata = {
  title: "About | Blaine Studio",
  description: "Artist bio, specialties, studio hygiene, certifications, and pricing & policies.",
}

export default function AboutPage() {
  const specialties = ["Fine line", "Black & gray", "Floral", "Script", "Minimal"]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:py-14">
      {/* Intro: portrait + bio */}
      <div className="grid gap-8 sm:grid-cols-[320px_1fr] sm:gap-12">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg border bg-muted" data-reveal>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src="/portfolio/Blaine%20Battle.mp4"
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div data-reveal>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About Blaine</h1>
          <p className="mt-3 max-w-prose text-foreground/80 whitespace-pre-line">
            {`My name is Blaine Reum. I'm 28 years old and from the Northshore of Oahu. I have been in love with tattooing practically most of my life. Any time not spent training jiujitsu, I try to dedicate to the practice of creating art. I picked up my first machine at 16 years old and have been a student of the science ever since. I enjoy tattooing any style of work from fine line, black & grey, realism, traditional American or Japanese—you want it, I'll tattoo it! But if you were to ask my preference, I'll always say 'Anything with bones or blades!'`}
          </p>

          <div className="mt-6">
            <div className="text-sm font-medium">Specialties</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {specialties.map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
              <span className="text-sm">Instagram</span>
            </Link>
            <Link
              href="mailto:reum808@gmail.com"
              className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
              <span className="text-sm">reum808@gmail.com</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hygiene */}
      <div className="mt-12 grid gap-8 sm:grid-cols-1">
        <Card data-reveal>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5" /> Hygiene & Sterilization
            </CardTitle>
            <CardDescription>Clean, safe, and comfortable from setup to aftercare.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-foreground/80">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-foreground/70" />
              Single‑use needles, cartridges, and barriers for every client
            </div>
            <Separator />
            <div className="flex items-start gap-2">
              <Syringe className="mt-0.5 h-4 w-4 text-foreground/70" />
              Medical‑grade cleaning and disinfection between all sessions
            </div>
            <Separator />
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-foreground/70" />
              Cross‑contamination protocols and documented sterilization logs
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Pricing & Policies temporarily removed */}
    </div>
  )
}




