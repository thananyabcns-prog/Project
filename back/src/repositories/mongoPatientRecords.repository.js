import { env } from '../config/env.js'
import { getMongoCollection } from '../database/mongodb.js'

export class MongoPatientRecordsRepository {
  constructor(collectionName = env.mongodbCollection) {
    this.collectionName = collectionName
  }

  async collection() {
    return getMongoCollection(this.collectionName)
  }

  async findAll() {
    const collection = await this.collection()
    return collection.find({}, { projection: { _id: 0 } }).sort({ updatedAt: -1 }).toArray()
  }

  async findById(id) {
    const collection = await this.collection()
    return collection.findOne({ id }, { projection: { _id: 0 } })
  }

  async create(record) {
    const collection = await this.collection()
    await collection.insertOne({ ...record })
    return record
  }

  async update(id, recordPatch) {
    const collection = await this.collection()
    const result = await collection.updateOne({ id }, { $set: { ...recordPatch, id } })

    if (result.matchedCount === 0) {
      return null
    }

    return this.findById(id)
  }

  async delete(id) {
    const collection = await this.collection()
    const result = await collection.deleteOne({ id })
    return result.deletedCount > 0
  }
}
