import { env } from '../config/env.js'
import { JsonFileStore } from './jsonFileStore.js'
import { MongoPatientRecordsRepository } from './mongoPatientRecords.repository.js'

class JsonPatientRecordsRepository {
  constructor(store) {
    this.store = store
  }

  async findAll() {
    const records = await this.store.readAll()
    return records.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }

  async findById(id) {
    const records = await this.store.readAll()
    return records.find((record) => record.id === id) || null
  }

  async create(record) {
    const records = await this.store.readAll()
    const nextRecords = [record, ...records]
    await this.store.writeAll(nextRecords)
    return record
  }

  async update(id, recordPatch) {
    const records = await this.store.readAll()
    const recordIndex = records.findIndex((record) => record.id === id)

    if (recordIndex === -1) {
      return null
    }

    const updatedRecord = {
      ...records[recordIndex],
      ...recordPatch,
      id,
    }

    records[recordIndex] = updatedRecord
    await this.store.writeAll(records)
    return updatedRecord
  }

  async delete(id) {
    const records = await this.store.readAll()
    const nextRecords = records.filter((record) => record.id !== id)

    if (records.length === nextRecords.length) {
      return false
    }

    await this.store.writeAll(nextRecords)
    return true
  }
}

function createPatientRecordsRepository() {
  if (env.storageDriver === 'mongodb') {
    return new MongoPatientRecordsRepository()
  }

  return new JsonPatientRecordsRepository(new JsonFileStore(env.jsonDataFile))
}

export const patientRecordsRepository = createPatientRecordsRepository()
