import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  storageDriver: process.env.STORAGE_DRIVER || 'json',
  jsonDataFile: process.env.JSON_DATA_FILE || './data/patient-records.json',
  mongodbUri: process.env.MONGODB_URI || '',
  mongodbDbName: process.env.MONGODB_DB_NAME || 'hos',
  mongodbCollection: process.env.MONGODB_COLLECTION || 'patient_records',
}
