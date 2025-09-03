export type StyleTag =
  | "black-gray"
  | "color"
  | "fine-line"
  | "realism"
  | "script"
  | "geometric"
  | "tribal"
  | "anime"

export type PlacementTag =
  | "arm"
  | "forearm"
  | "wrist"
  | "chest"
  | "back"
  | "shoulder"
  | "calf"
  | "thigh"

export type HealedState = "healed" | "fresh"

export interface PortfolioItem {
  id: string
  src?: string
  videoSrc?: string
  alt: string
  styles: StyleTag[]
  placements: PlacementTag[]
  date: string // ISO date
  state?: HealedState
}

export interface Testimonial {
  quote: string
  author: string
  url?: string
}
