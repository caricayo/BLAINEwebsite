"use client"

import { useEffect } from "react"

export function RevealOnScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!('IntersectionObserver' in window) || els.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    )

    els.forEach(el => {
      // start in hidden state
      el.classList.add('will-reveal')
      io.observe(el)
    })

    return () => io.disconnect()
  }, [])

  return null
}

