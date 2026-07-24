import { env } from '../config/env.js'
import { getMongoClient } from '../database/mongodb.js'

export async function checkDatabaseHealth() {
  if (env.storageDriver !== 'mongodb') {
    return {
      status: 'ok',
      storageDriver: env.storageDriver,
    }
  }

  try {
    const client = await getMongoClient()
    await client.db(env.mongodbDbName).command({ ping: 1 })
  } catch (error) {
    return {
      status: 'error',
      storageDriver: env.storageDriver,
      database: env.mongodbDbName,
      collection: env.mongodbCollection,
      code: error.code || error.name,
      message: error.message,
    }
  }

  return {
    status: 'ok',
    storageDriver: env.storageDriver,
    database: env.mongodbDbName,
    collection: env.mongodbCollection,
  }
}
