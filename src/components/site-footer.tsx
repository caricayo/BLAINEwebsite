import Link from "next/link"
import { Instagram, Facebook, Mail, MapPin, Clock } from "lucide-react"
import { site } from "@/config/site"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="text-lg font-semibold">Sacred art tattoo and coffe bar</div>
          <div className="mt-3 text-sm text-foreground/70">
            <Link
              href="https://maps.google.com/?q=1925+Kal%C4%81kaua+Ave+Unit+A,+Honolulu,+HI+96815"
              className="inline-flex items-center gap-2 hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin className="h-4 w-4" /> Address: 1925 Kalākaua Ave Unit A, Honolulu, HI 96815
            </Link>
          </div>
          <div className="mt-2 text-sm text-foreground/70 flex flex-col gap-1">
            <div className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> Monday 7AM–12AM</div>
            <div className="pl-6">Tuesday 7AM–12AM</div>
            <div className="pl-6">Wednesday 7AM–12AM</div>
            <div className="pl-6">Thursday 7AM–12AM</div>
            <div className="pl-6">Friday 7AM–12AM</div>
            <div className="pl-6">Saturday 7AM–12AM</div>
            <div className="pl-6">Sunday 7AM–12AM</div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Link href={site.instagram.profileUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-foreground/70 hover:text-foreground">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Facebook" className="text-foreground/70 hover:text-foreground">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="mailto:reum808@gmail.com" aria-label="Email" className="text-foreground/70 hover:text-foreground">
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium">Quick Links</div>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            <li>
              <Link href="/portfolio" className="hover:text-foreground">Portfolio</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-foreground">About</Link>
            </li>
            <li>
              <Link href="/booking" className="hover:text-foreground">Booking</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-foreground">FAQ</Link>
            </li>
            <li>
              <Link href="/aftercare" className="hover:text-foreground">Aftercare</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium">Contact</div>
          <ul className="mt-3 space-y-2 text-sm text-foreground/70">
            <li>
              <Link href="mailto:reum808@gmail.com" className="hover:text-foreground">reum808@gmail.com</Link>
            </li>
            <li>
              <Link href="sms:+18087440880" className="hover:text-foreground">(808) 744-0880</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">Map & Directions</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-foreground/60">
        © {new Date().getFullYear()} Blaine Studio. All rights reserved.
      </div>
    </footer>
  )
}
