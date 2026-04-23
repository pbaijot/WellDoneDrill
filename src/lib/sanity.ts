import {createClient} from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_READ_TOKEN

export const sanity =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion: '2026-04-22',
        useCdn: false,
        token,
      })
    : null
