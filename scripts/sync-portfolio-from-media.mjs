#!/usr/bin/env node
import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, extname, basename } from 'node:path'

import { fileURLToPath } from 'node:url'
const here = fileURLToPath(import.meta.url)
const projectRoot = join(here, '..', '..')
const mediaDir = join(projectRoot, 'public', 'portfolio')
const dataPath = join(projectRoot, 'data', 'portfolio.json')

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])
const VIDEO_EXT = new Set(['.mp4', '.mov'])

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const humanize = (name) => name
  .replace(/[-_]+/g, ' ')
  .replace(/\s+/g, ' ')
  .replace(/\s*\(\s*/g, ' (')
  .replace(/\s*\)\s*/g, ') ')
  .trim()

const files = readdirSync(mediaDir, { withFileTypes: true })
  .filter((d) => d.isFile())
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b))

const items = []
for (const name of files) {
  const ext = extname(name).toLowerCase()
  const full = join(mediaDir, name)
  const mtime = statSync(full).mtime
  const base = basename(name, ext)
  const id = slugify(base + '-' + ext.slice(1))
  const common = {
    id,
    alt: humanize(base),
    styles: [],
    placements: [],
    date: mtime.toISOString().slice(0, 10),
  }
  if (VIDEO_EXT.has(ext)) {
    items.push({ ...common, videoSrc: `/portfolio/${name}` })
  } else if (IMAGE_EXT.has(ext)) {
    items.push({ ...common, src: `/portfolio/${name}` })
  }
}

writeFileSync(dataPath, JSON.stringify(items, null, 2) + '\n')
console.log(`Wrote ${items.length} items to data/portfolio.json`)
