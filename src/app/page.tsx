import Link from "next/link"
import { InstagramGrid } from "@/components/instagram-grid"
import { site } from "@/config/site"
import type { Testimonial } from "@/types"
import testimonials from "../../data/testimonials.json"
import { Button } from "@/components/ui/button"
import { InlineVideo } from "@/components/inline-video"

export default function Home() {
  const works = [
    { id: 20, src: "/portfolio/20.mp4", alt: "Featured video 20" },
  ]

  const quotes = testimonials as Testimonial[]

  return (
    <div className="relative">
      {/* Full‑bleed hero */}
      <section className="relative isolate">
        <div className="relative w-full">
          {/* No background media */}

          {/* Hero content */}
          <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
            <div className="max-w-2xl" data-reveal>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Blaine Reum</h1>
              <p className="mt-3 text-base text-foreground/80 sm:text-lg">Tatto artist who cares about design, healing and your story.</p>
              <div className="mt-6 flex gap-3">
                <Button asChild>
                  <Link href="/booking">Book Now</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/portfolio">View Portfolio</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent works grid (3x2) */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:py-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Recent Works</h2>
          <Link href="/portfolio" className="text-sm text-foreground/70 hover:text-foreground">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 sm:gap-4">
          {works.map((w) => (
            <div
              key={w.id}
              className="group relative overflow-hidden rounded-md border bg-card hover-scale"
              data-reveal
            >
              <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
                <InlineVideo src={w.src} alt={w.alt} />
              </div>
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_hsl(var(--color-border))]" />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial strip */}
      <section className="border-y bg-muted/30 py-10">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:grid-cols-3">
          {quotes.map((q, i) => (
            <figure key={i} className="rounded-lg border bg-card p-5" data-reveal>
              <blockquote className="text-sm leading-relaxed text-foreground/80">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-3 text-xs text-foreground/60">— {q.author}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Instagram section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:py-16" aria-labelledby="ig-heading">
        <div className="mb-6 flex items-end justify-between">
          <h2 id="ig-heading" className="text-xl font-semibold">From Instagram</h2>
          <Link href={site.instagram.profileUrl} className="text-sm text-foreground/70 hover:text-foreground" target="_blank" rel="noopener noreferrer">
            See more on Instagram →
          </Link>
        </div>
        <InstagramGrid />
      </section>

      {/* Global mobile sticky booking bar is in layout */}
    </div>
  )
}
