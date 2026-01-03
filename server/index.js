import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({
  origin: '*',
}))

app.use(express.json())

app.get('/api', (req, res) => {
  res.json({ status: 'API running' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
