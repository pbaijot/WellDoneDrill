import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'o8tuydyo',
    dataset: 'production'
  },
  // Hosted Studio: https://welldonedrill.sanity.studio (npx sanity deploy)
  studioHost: 'welldonedrill',
})
