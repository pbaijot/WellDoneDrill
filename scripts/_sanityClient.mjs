import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Minimal .env.local parser (avoids extra deps)
function loadEnv() {
  try {
    const raw = readFileSync(join(__dirname, '..', '.env.local'), 'utf8')
    const env = {}
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
    return env
  } catch {
    return {}
  }
}

const env = {...loadEnv(), ...process.env}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || env.SANITY_PROJECT_ID || 'o8tuydyo'
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || env.SANITY_DATASET || 'production'

export const readClient = createClient({
  projectId,
  dataset,
  apiVersion: '2026-04-22',
  useCdn: false,
  token: env.SANITY_API_READ_TOKEN,
})

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion: '2026-04-22',
  useCdn: false,
  token: env.SANITY_API_TOKEN || env.SANITY_API_READ_TOKEN,
})

export {env}
