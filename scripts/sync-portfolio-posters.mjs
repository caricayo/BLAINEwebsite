#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname, extname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const root = join(__dirname, '..')
const dataPath = join(root, 'data', 'portfolio.json')
const mediaDir = join(root, 'public', 'portfolio')

function findPosterFor(videoPath) {
  try {
    const rel = videoPath.startsWith('/') ? videoPath.slice(1) : videoPath
    const inPortfolio = rel.startsWith('portfolio/') ? rel.slice('portfolio/'.length) : rel
    const base = basename(inPortfolio, extname(inPortfolio))
    const candidates = [
      `${base}-cover.jpg`,
      `${base}-cover.jpeg`,
      `${base}-cover.png`,
      `${base}.jpg`,
      `${base}.jpeg`,
      `${base}.png`,
    ]
    for (const c of candidates) {
      const p = join(mediaDir, c)
      if (existsSync(p)) {
        return `/portfolio/${c}`
      }
    }
  } catch {}
  return null
}

function main() {
  const before = JSON.parse(readFileSync(dataPath, 'utf8'))
  let updated = 0
  const after = before.map((item) => {
    if (item && item.videoSrc && !item.src) {
      const poster = findPosterFor(item.videoSrc)
      if (poster) {
        updated++
        return { ...item, src: poster }
      }
    }
    return item
  })
  if (updated > 0) {
    writeFileSync(dataPath, JSON.stringify(after, null, 2) + '\n', 'utf8')
    console.log(`Updated ${updated} portfolio entries with poster src.`)
  } else {
    console.log('No matching posters found. Nothing to update.')
  }
}

main()

