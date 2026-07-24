import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import { patientRecordsRouter } from './routes/patientRecords.routes.js'
import { checkDatabaseHealth } from './services/health.service.js'
import { asyncHandler } from './utils/asyncHandler.js'

export function createApp() {
  const app = express()

  app.use(cors({ origin: env.frontendOrigin }))
  app.use(express.json({ limit: '2mb' }))

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'hos-backend' })
  })

  app.get(
    '/health/db',
    asyncHandler(async (_req, res) => {
      res.json(await checkDatabaseHealth())
    }),
  )

  app.use('/api/patient-records', patientRecordsRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
