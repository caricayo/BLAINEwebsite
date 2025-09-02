#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const mediaDir = join(root, 'public', 'portfolio')
const dataPath = join(root, 'data', 'portfolio.json')

const entries = JSON.parse(readFileSync(dataPath, 'utf8'))
const files = new Set(readdirSync(mediaDir))

let missing = 0
for (const e of entries) {
  const p = e.videoSrc || e.src
  if (!p || !p.startsWith('/portfolio/')) continue
  const name = p.replace('/portfolio/', '')
  if (!files.has(name)) {
    console.warn(`[validate] Missing: ${p}`)
    missing++
  }
}

if (missing === 0) {
  console.log('[validate] All portfolio media entries exist in /public/portfolio')
  process.exit(0)
} else {
  console.error(`[validate] ${missing} missing references found.`)
  process.exit(1)
}
