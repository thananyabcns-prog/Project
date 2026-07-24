import { MongoClient } from 'mongodb'
import { env } from '../config/env.js'

let clientPromise

export function getMongoClient() {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is required when STORAGE_DRIVER=mongodb')
  }

  if (!clientPromise) {
    const client = new MongoClient(env.mongodbUri)
    clientPromise = client.connect()
  }

  return clientPromise
}

export async function getMongoCollection(collectionName = env.mongodbCollection) {
  const client = await getMongoClient()
  return client.db(env.mongodbDbName).collection(collectionName)
}
