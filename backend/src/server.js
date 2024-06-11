import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

//import
import dbConnect from './db/db.js'

// config
dotenv.config({
  path: './.env',
})

// db connect
dbConnect()

const app = express()

// middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser())

// routes
import authRoutes from './Routes/auth.routes.js'
import candidatesRoutes from './Routes/candidates.routes.js'
import voterRoutes from './Routes/voter.routes.js'

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/candidate', candidatesRoutes)
app.use('/api/v1/votes', voterRoutes)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server start at ${PORT}`)
})
