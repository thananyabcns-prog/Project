import dotenv from 'dotenv'

dotenv.config()

function listFromEnv(value, fallback) {
  return (value || fallback)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export const env = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  frontendOrigins: listFromEnv(process.env.FRONTEND_ORIGIN, 'http://localhost:5173'),
  storageDriver: process.env.STORAGE_DRIVER || 'json',
  jsonDataFile: process.env.JSON_DATA_FILE || './data/patient-records.json',
  adminActivityFile: process.env.ADMIN_ACTIVITY_FILE || './data/admin-activity.json',
  mongodbUri: process.env.MONGODB_URI || '',
  mongodbDbName: process.env.MONGODB_DB_NAME || 'hos',
  mongodbCollection: process.env.MONGODB_COLLECTION || 'patient_records',
  mongodbActivityCollection: process.env.MONGODB_ACTIVITY_COLLECTION || 'admin_activity',
  adminPassword: process.env.ADMIN_PASSWORD || '',
}
