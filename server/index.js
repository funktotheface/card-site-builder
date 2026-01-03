import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

// Enable CORS for dev
app.use(cors({
  origin: '*'  // allow all origins for dev
}))

app.use(express.json())
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Path to sites.json
const sitesPath = path.join(process.cwd(), 'data', 'sites.json')

// GET /sites/:slug
app.get('/sites/:slug', (req, res) => {
  const { slug } = req.params
  const sites = JSON.parse(fs.readFileSync(sitesPath))
  const site = sites.find(s => s.slug === slug)
  if (!site) return res.status(404).json({ error: 'Site not found' })
  res.json(site)
})

// POST /sites
app.post('/sites', (req, res) => {
  const newSite = req.body
  const sites = JSON.parse(fs.readFileSync(sitesPath))
  sites.push(newSite)
  fs.writeFileSync(sitesPath, JSON.stringify(sites, null, 2))
  res.status(201).json(newSite)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
