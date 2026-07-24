import { env } from '../config/env.js'
import { getMongoClient } from '../database/mongodb.js'

export async function checkDatabaseHealth() {
  if (env.storageDriver !== 'mongodb') {
    return {
      status: 'ok',
      storageDriver: env.storageDriver,
    }
  }

  const client = await getMongoClient()
  await client.db(env.mongodbDbName).command({ ping: 1 })

  return {
    status: 'ok',
    storageDriver: env.storageDriver,
    database: env.mongodbDbName,
    collection: env.mongodbCollection,
  }
}
