import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import schemas from './src/sanity/schemas'

const projectId = 'pcb71lpe'   // ← hardcode your real ID
const dataset = 'production'

if (!projectId) {
  throw new Error(
    'Missing SANITY_PROJECT_ID. Check your .env file in studio folder and restart the dev server.'
  )
}

export default defineConfig({
  projectId,
  dataset,
  plugins: [deskTool(), visionTool(), codeInput()],
  schema: { types: schemas },
})
