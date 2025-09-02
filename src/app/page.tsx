import Link from "next/link"
import Image from "next/image"
import { InstagramGrid } from "@/components/instagram-grid"
import { site } from "@/config/site"
import type { Testimonial } from "@/types"
import testimonials from "../../data/testimonials.json"
import { Button } from "@/components/ui/button"

export default function Home() {
  const works = [
    { id: 1, src: "/globe.svg", alt: "Tattoo 1" },
    { id: 2, src: "/window.svg", alt: "Tattoo 2" },
    { id: 3, src: "/file.svg", alt: "Tattoo 3" },
    { id: 4, src: "/next.svg", alt: "Tattoo 4" },
    { id: 5, src: "/vercel.svg", alt: "Tattoo 5" },
    { id: 6, src: "/globe.svg", alt: "Tattoo 6" },
  ]

  const quotes = testimonials as Testimonial[]

  return (
    <div className="relative">
      {/* Full‑bleed hero */}
      <section className="relative isolate">
        <div className="relative h-[70vh] min-h-[28rem] w-full overflow-hidden">
          {/* Optional video hero at /public/hero.mp4; falls back to image overlay */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-label="Hero video"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />
          <Image
            src="/globe.svg"
            alt="Featured artwork placeholder"
            fill
            priority
            className="object-cover opacity-10"
          />

          {/* Hero content */}
          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-10">
            <div className="max-w-2xl" data-reveal>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Craft on Skin</h1>
              <p className="mt-3 text-base text-foreground/80 sm:text-lg">
                Custom tattoos by artists who care about design, healing, and your story.
              </p>
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {works.map((w) => (
            <Link
              key={w.id}
              href="/portfolio"
              className="group relative overflow-hidden rounded-md border bg-card hover-scale"
              aria-label={`Open ${w.alt}`}
              data-reveal
            >
              <div
                className="relative w-full"
                style={{ aspectRatio: "4 / 5" }}
              >
                <Image
                  src={w.src}
                  alt={w.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  className="object-cover transition duration-300 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_hsl(var(--color-border))]" />
            </Link>
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
