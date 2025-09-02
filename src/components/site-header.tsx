"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/booking", label: "Booking" },
  { href: "/faq", label: "FAQ" },
  { href: "/aftercare", label: "Aftercare" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:h-16">
        {/* Mobile: Drawer trigger */}
        <div className="flex flex-1 items-center gap-3 sm:flex-none">
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>Sacred Art Tattoo and Coffee Bar</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 grid gap-2">
                  {links.map((l) => (
                    <Button key={l.href} variant="ghost" asChild className="justify-start">
                      <Link href={l.href}>{l.label}</Link>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="font-semibold tracking-wide">
            Sacred Art Tattoo and Coffee Bar
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden flex-1 justify-center sm:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {links.map((l) => (
                <NavigationMenuItem key={l.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={l.href}
                      className={cn(
                        "px-3 py-2 text-sm transition-colors hover:text-foreground/80",
                        pathname === l.href ? "text-foreground" : "text-foreground/60"
                      )}
                    >
                      {l.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
          <ModeToggle />
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/booking">Book Now</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
