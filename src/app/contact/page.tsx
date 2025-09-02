"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, MessageSquareText, MapPin, Clock, CarFront, Accessibility, Shield } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Tell us a bit more"),
  // Honeypot must be empty
  company: z.string().optional().refine((v) => !v, { message: "" }),
  // Turnstile placeholder: must be checked
  human: z.boolean().refine((v) => v === true, { message: "Please verify you’re human" }),
})

type Values = z.infer<typeof schema>

export default function ContactPage() {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { human: false } })
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async (data: Values) => {
    // Normally we would POST to an API route; for now, simulate success.
    await new Promise((r) => setTimeout(r, 600))
    setSubmitted(true)
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:py-10">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Contact & Visit</h1>
          <p className="mt-1 text-sm text-foreground/70">Questions, bookings, or studio info — we’re here to help.</p>
        </div>
        <Button asChild className="hidden sm:inline-flex">
          <Link href="/booking">Book Now</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Left: quick contact + form */}
        <div className="space-y-6">
          <Card data-reveal>
            <CardHeader>
              <CardTitle className="text-lg">Quick contact</CardTitle>
              <CardDescription>Reach us directly by email or SMS.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-foreground/70" />
                <Link href="mailto:studio@example.com" className="hover:underline">
                  studio@example.com
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquareText className="h-4 w-4 text-foreground/70" />
                <Link href="sms:+15551234567" className="hover:underline">
                  +1 (555) 123‑4567
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card data-reveal>
            <CardHeader>
              <CardTitle className="text-lg">Send a message</CardTitle>
              <CardDescription>We reply within 1–2 business days.</CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <Alert>
                  <AlertTitle>Thanks — message received</AlertTitle>
                  <AlertDescription className="text-foreground/80">
                    We’ll get back to you at the email provided. For urgent matters, please SMS.
                  </AlertDescription>
                </Alert>
              ) : (
                <Form {...form}>
                  <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                    {/* honeypot */}
                    <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...form.register("company")} />

                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea rows={5} placeholder="How can we help?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Turnstile placeholder */}
                    <div className="rounded-md border bg-muted/40 p-3 text-xs">
                      <div className="font-medium mb-1 flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Spam protection</div>
                      <p className="text-foreground/70">Turnstile placeholder — an interactive challenge would appear here in production.</p>
                      <div className="mt-2 flex items-center gap-2">
                        <input id="human" type="checkbox" onChange={(e) => form.setValue("human", e.target.checked, { shouldValidate: true })} />
                        <label htmlFor="human">I’m not a robot (placeholder)</label>
                      </div>
                      <FormMessage />
                    </div>

                    <div className="flex items-center gap-3">
                      <Button type="submit">Send message</Button>
                      <Button asChild variant="outline">
                        <Link href="/booking">Book Now</Link>
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: map + info */}
        <div className="space-y-6">
          <Card data-reveal>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-4 w-4" /> Find us</CardTitle>
              <CardDescription>123 Ink Lane, Suite 2B, Seattle, WA 98101</CardDescription>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={16 / 9}>
                <iframe
                  title="Studio map"
                  src="https://www.google.com/maps?q=123%20Ink%20Lane%20Seattle%20WA&output=embed"
                  className="h-full w-full rounded-md border"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </AspectRatio>
            </CardContent>
          </Card>

          <Card data-reveal>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Clock className="h-4 w-4" /> Hours</CardTitle>
              <CardDescription>Walk‑ins welcome if available; bookings prioritized.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-foreground/80">
              Tue–Sat: 11:00–7:00
              <br /> Sun–Mon: Closed
            </CardContent>
            <Separator />
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><CarFront className="h-4 w-4" /> Parking</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/80">
              Street parking on 3rd Ave; paid lot across the street. Please allow extra time during events.
            </CardContent>
            <Separator />
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Accessibility className="h-4 w-4" /> Accessibility</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-foreground/80">
              Wheelchair‑accessible entrance and restroom. Fragrance‑free request. Let us know if you need any accommodations.
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/booking">Book Now</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
