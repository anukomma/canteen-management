import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'

import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import managerRoutes from './routes/manager.js'
import cashierRoutes from './routes/cashier.js'
import studentRoutes from './routes/student.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => res.json({ status: 'ok', service: 'mealcard-backend' }))

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/manager', managerRoutes)
app.use('/api/cashier', cashierRoutes)
app.use('/api/student', studentRoutes)

const PORT = process.env.PORT || 4000
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected')
  app.listen(PORT, () => console.log(`Server running on :${PORT}`))
}).catch(err => {
  console.error('MongoDB connection error', err)
  process.exit(1)
})
