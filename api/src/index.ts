import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { analyzeRouter } from './routes/analyze.js'

const app = new Hono()

app.use(cors({
  origin: (origin) =>
    origin === 'http://localhost:3000' || /\.vercel\.app$/.test(origin)
      ? origin
      : null,
  credentials: true,
}))

app.get('/', (c) => c.text('VouchIT API 🚀'))
app.get('/health', (c) => c.json({ ok: true, ts: Date.now() }))
app.route('/', analyzeRouter)

const port = Number(process.env.PORT) || 3001

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`)
})
