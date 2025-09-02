"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, addHours } from "date-fns"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

const styleOptions = [
  { value: "black-gray", label: "Black & gray" },
  { value: "color", label: "Color" },
  { value: "fine-line", label: "Fine line" },
  { value: "realism", label: "Realism" },
  { value: "script", label: "Script" },
  { value: "geometric", label: "Geometric" },
]

const placementOptions = [
  "arm",
  "forearm",
  "wrist",
  "chest",
  "back",
  "shoulder",
  "calf",
  "thigh",
]

const bookingSchema = z.object({
  // Step 1
  style: z.enum(["black-gray", "color", "fine-line", "realism", "script", "geometric"] as const),
  colorMode: z.enum(["color", "black-gray"] as const),
  placement: z.enum(["arm", "forearm", "wrist", "chest", "back", "shoulder", "calf", "thigh"] as const),
  size: z.string().min(2, "Enter approximate size"),
  references: z.any().optional(),
  notes: z.string().max(800).optional(),

  // Step 2
  date: z.date(),
  timeWindow: z.enum(["morning", "afternoon", "evening"] as const),

  // Step 3
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  ageConfirm: z.boolean().refine((v) => v === true, { message: "You must confirm you are 18+ or have parental consent on arrival" }),
})

type BookingValues = z.infer<typeof bookingSchema>

export default function BookingPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [processing, setProcessing] = useState(false)

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onBlur",
    defaultValues: {
      colorMode: "black-gray",
      timeWindow: "afternoon",
    },
  })

  const nextStep = async () => {
    const fieldsByStep: Record<number, (keyof BookingValues)[]> = {
      1: ["style", "colorMode", "placement", "size"],
      2: ["date", "timeWindow"],
      3: ["name", "email", "ageConfirm"],
      4: [],
      5: [],
    }
    const toValidate = fieldsByStep[step]
    const valid = toValidate.length ? await form.trigger(toValidate) : true
    if (valid) setStep((s) => (s < 4 ? ((s + 1) as typeof s) : s))
  }

  const prevStep = () => setStep((s) => (s > 1 ? ((s - 1) as typeof s) : s))

  const onDeposit = async () => {
    setProcessing(true)
    try {
      const toLines = [
        `Name: ${values.name || ''}`,
        `Email: ${values.email || ''}`,
        values.phone ? `Phone: ${values.phone}` : '',
        `Style: ${values.style || ''}`,
        `Color mode: ${values.colorMode || ''}`,
        `Placement: ${values.placement || ''}`,
        `Size: ${values.size || ''}`,
        `Preferred date: ${values.date ? format(values.date, 'PPP') : ''}`,
        `Time window: ${values.timeWindow || ''}`,
      ].filter(Boolean)
      const subject = encodeURIComponent('New booking request')
      const body = encodeURIComponent(toLines.join('\n'))
      const mailto = `mailto:reum808@gmail.com?subject=${subject}&body=${body}`
      window.location.href = mailto
      setStep(5)
    } finally {
      setProcessing(false)
    }
  }

  const values = form.watch()
  const eventTimes = useMemo(() => {
    if (!values.date) return null
    const start = values.date
    const end = addHours(start, 2)
    return { start, end }
  }, [values.date])

  const downloadICS = () => {
    if (!eventTimes) return
    const dt = (d: Date) => format(d, "yyyyMMdd'T'HHmmss")
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Blaine Studio//Booking//EN",
      "BEGIN:VEVENT",
      `UID:${Date.now()}@blaine.studio`,
      `DTSTAMP:${dt(new Date())}`,
      `DTSTART:${dt(eventTimes.start)}`,
      `DTEND:${dt(eventTimes.end)}`,
      "SUMMARY:Tattoo Appointment — Blaine Studio",
      `DESCRIPTION:Style: ${values.style || ""}; Placement: ${values.placement || ""}"`,
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
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Book an appointment</h1>
      <p className="mt-2 text-sm text-foreground/70">Single-artist booking. We’ll confirm by email after deposit.</p>

      <Separator className="my-6" />

      {step <= 4 && (
        <div className="mb-4 text-xs text-foreground/70">Step {step} of 4</div>
      )}

      {step === 1 && (
        <Card data-reveal>
          <CardHeader>
            <CardTitle>Design details</CardTitle>
            <CardDescription>Tell us about your piece.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="grid gap-6">
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger aria-label="Select a style">
                            <SelectValue placeholder="Select a style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {styleOptions.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="colorMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color or B&W</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem id="color" value="color" />
                            <label htmlFor="color" className="text-sm">Color</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem id="bw" value="black-gray" />
                            <label htmlFor="bw" className="text-sm">Black & gray</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="placement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placement</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-2"
                        >
                          {placementOptions.map((p) => (
                            <div key={p} className="">
                              <RadioGroupItem id={`pl-${p}`} value={p} className="peer sr-only" />
                              <label
                                htmlFor={`pl-${p}`}
                                className="cursor-pointer select-none rounded-full border px-3 py-1.5 text-xs capitalize shadow-sm transition peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                              >
                                {p}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>Exact placement and sizing will be confirmed during consultation.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approximate size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3 in × 5 in" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Anything we should know?" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-xs text-foreground/70">
                  If possible, attach 1–3 reference images in the email after you press “Send request”.
                </p>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div />
            <Button onClick={nextStep}>Next</Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card data-reveal>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>Pick a preferred date and time window.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="grid gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className="w-[260px] justify-start font-normal">
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus key={field.value ? field.value.toDateString() : "no-date"}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeWindow"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time window</FormLabel>
                      <FormControl>
                        <RadioGroup
                          className="flex flex-wrap gap-3"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          {(
                            [
                              { v: "morning", l: "Morning" },
                              { v: "afternoon", l: "Afternoon" },
                              { v: "evening", l: "Evening" },
                            ] as const
                          ).map((t) => (
                            <div key={t.v} className="flex items-center gap-2">
                              <RadioGroupItem id={`tw-${t.v}`} value={t.v} />
                              <label htmlFor={`tw-${t.v}`} className="text-sm">
                                {t.l}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Next</Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card data-reveal>
          <CardHeader>
            <CardTitle>Contact & consent</CardTitle>
            <CardDescription>We’ll use this to confirm your appointment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="grid gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid gap-6 sm:grid-cols-2">
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
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="ageConfirm"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">I am 18+ years old or have parental consent on arrival</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Next</Button>
          </CardFooter>
        </Card>
      )}

      {step === 4 && (
        <Card data-reveal>
          <CardHeader>
            <CardTitle>Review \& send request</CardTitle>
            <CardDescription>Confirm your details and send your request to the studio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="font-medium">Design</div>
              <div className="text-foreground/80">{values.style} • {values.colorMode} • {values.placement} • {values.size}</div>
            </div>
            <Separator />
            <div>
              <div className="font-medium">Availability</div>
              <div className="text-foreground/80">
                {values.date ? format(values.date, "PPP") : "—"} {values.timeWindow ? `• ${values.timeWindow}` : ""}
              </div>
            </div>
            <Separator />
            <div>
              <div className="font-medium">Contact</div>
              <div className="text-foreground/80">{values.name} • {values.email}{values.phone ? ` • ${values.phone}` : ""}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={onDeposit} disabled={processing}>{processing ? "Processing…" : "Send request"}</Button>
          </CardFooter>
        </Card>
      )}

      {step === 5 && (
        <Card data-reveal>
          <CardHeader>
            <CardTitle>Request sent</CardTitle>
            <CardDescription>
              We’ve opened your email client with the booking summary. We’ll reply with confirmation and next steps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-foreground/80">
              Add this to your calendar and keep an eye on your inbox. If you need to reschedule, use the link in your email.
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            <Button onClick={downloadICS} disabled={!eventTimes}>Download .ics</Button>
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}




