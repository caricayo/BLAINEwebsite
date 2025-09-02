import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export const metadata = {
  title: "Aftercare | Blaine Studio",
  description: "Simple, effective tattoo aftercare: first 24 hours, first week, and long‑term care.",
}

export default function AftercarePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <Card data-reveal>
        <CardHeader>
          <CardTitle>Tattoo Aftercare</CardTitle>
          <CardDescription>Healthy healing for long‑lasting results.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-6 pt-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-base font-semibold">First 24 hours</h2>
            <ul className="mt-2 list-disc pl-5 text-foreground/80">
              <li>Leave the bandage on for the time advised by your artist.</li>
              <li>Wash hands, then gently clean with lukewarm water and a mild, fragrance‑free soap.</li>
              <li>Pat dry with a clean paper towel — do not rub.</li>
              <li>Apply a thin layer of recommended ointment if instructed.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold">Days 2–7</h2>
            <ul className="mt-2 list-disc pl-5 text-foreground/80">
              <li>Clean once or twice daily; keep the area moisturized with a fragrance‑free lotion.</li>
              <li>Avoid soaking, pools, hot tubs, and direct sunlight.</li>
              <li>Do not pick or scratch; light flaking/itching is normal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold">Weeks 2–4</h2>
            <ul className="mt-2 list-disc pl-5 text-foreground/80">
              <li>Continue moisturizing; protect from sun exposure (SPF 30+ after fully healed).</li>
              <li>Resume normal activity once skin has fully closed and flaking has subsided.</li>
            </ul>
          </section>

          <Alert>
            <AlertTitle>When to contact us</AlertTitle>
            <AlertDescription className="text-foreground/80">
              If you notice unusual redness, swelling, rash, or signs of infection, reach out to us
              at <Link href="mailto:blainreum808@gmail.com" className="underline">blainreum808@gmail.com</Link> or SMS <Link href="sms:+18087440880" className="underline">(808) 744‑0880</Link>.
            </AlertDescription>
          </Alert>

          <div className="text-xs text-foreground/70">
            This guide is for general information only and does not replace professional medical advice.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
