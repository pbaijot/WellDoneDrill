import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'o8tuydyo'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_READ_TOKEN

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2026-04-22',
  useCdn: false,
  token,
})
