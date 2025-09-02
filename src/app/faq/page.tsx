import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata = {
  title: "FAQ | Blaine Studio",
  description: "Answers to common questions about booking, deposits, age/ID, and aftercare.",
}

export default function FAQPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <Card data-reveal>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What’s the deposit and is it refundable?</AccordionTrigger>
              <AccordionContent>
                A non‑refundable deposit secures your appointment and goes toward your final session. If you need to reschedule, please provide at least 48 hours’ notice to retain your deposit.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What should I bring to my appointment?</AccordionTrigger>
              <AccordionContent>
                A government‑issued photo ID, any necessary reference images, comfortable clothing for the placement area, and hydration/snacks for longer sessions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Do you tattoo minors?</AccordionTrigger>
              <AccordionContent>
                We only tattoo clients 18+ with valid ID.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How do I care for my new tattoo?</AccordionTrigger>
              <AccordionContent>
                Follow our aftercare guide. Keep the area clean, moisturized, and out of direct sun while healing. See the full checklist on the Aftercare page.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>What if I’m running late?</AccordionTrigger>
              <AccordionContent>
                Please notify us as soon as possible. Arrivals beyond 15 minutes may require rescheduling and a new deposit.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

