#!/usr/bin/env node
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const roots = [join(process.cwd(), 'src', 'app'), join(process.cwd(), 'data')]
const exts = new Set(['.tsx', '.ts', '.json'])
const badPatterns = [ /�/, /Â/, /Ã/, /â/, /\uFFFD/ ]
let badFiles = []

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    else if ([...exts].some((e) => p.endsWith(e))) {
      const buf = readFileSync(p)
      const txt = buf.toString('utf8')
      // If decoding changed length, likely non-UTF8
      if (Buffer.byteLength(txt, 'utf8') !== buf.length) {
        badFiles.push({ file: p, reason: 'non-utf8' })
        continue
      }
      if (badPatterns.some((re) => re.test(txt))) {
        badFiles.push({ file: p, reason: 'mojibake' })
      }
    }
  }
}

for (const root of roots) {
  try { walk(root) } catch {}
}

if (badFiles.length) {
  console.error('Mojibake/non-UTF8 detected:')
  for (const b of badFiles) console.error(` - ${b.file} (${b.reason})`)
  process.exit(1)
}
