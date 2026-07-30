import { env } from '../config/env.js'
import { getMongoCollection } from '../database/mongodb.js'
import { JsonFileStore } from './jsonFileStore.js'

const actionCounterMap = {
  page_view: 'viewCount',
  record_list_view: 'recordsOpenCount',
  record_save: 'saveCount',
  print_form: 'printCount',
}

function getActionCounter(action) {
  return actionCounterMap[action] || 'otherActionCount'
}

class JsonActivityRepository {
  constructor(store) {
    this.store = store
  }

  async track(activity) {
    const records = await this.store.readAll()
    const now = activity.at
    const recordIndex = records.findIndex((record) => record.deviceId === activity.deviceId)
    const actionCounter = getActionCounter(activity.action)

    if (recordIndex === -1) {
      const nextRecord = {
        deviceId: activity.deviceId,
        firstSeenAt: now,
        lastSeenAt: now,
        actionCount: 1,
        viewCount: 0,
        recordsOpenCount: 0,
        saveCount: 0,
        printCount: 0,
        otherActionCount: 0,
        [actionCounter]: 1,
        ...activity.device,
        ipAddress: activity.ipAddress,
        lastAction: activity.action,
        actions: [activity.event],
      }

      records.unshift(nextRecord)
      await this.store.writeAll(records)
      return nextRecord
    }

    const currentRecord = records[recordIndex]
    const nextRecord = {
      ...currentRecord,
      ...activity.device,
      ipAddress: activity.ipAddress,
      lastSeenAt: now,
      lastAction: activity.action,
      actionCount: (currentRecord.actionCount || 0) + 1,
      [actionCounter]: (currentRecord[actionCounter] || 0) + 1,
      actions: [...(currentRecord.actions || []), activity.event].slice(-40),
    }

    records[recordIndex] = nextRecord
    await this.store.writeAll(records)
    return nextRecord
  }

  async findAll() {
    const records = await this.store.readAll()
    return records.sort((a, b) => new Date(b.lastSeenAt) - new Date(a.lastSeenAt))
  }
}

class MongoActivityRepository {
  constructor(collectionName = env.mongodbActivityCollection) {
    this.collectionName = collectionName
  }

  async collection() {
    return getMongoCollection(this.collectionName)
  }

  async track(activity) {
    const collection = await this.collection()
    const actionCounter = getActionCounter(activity.action)

    await collection.updateOne(
      { deviceId: activity.deviceId },
      {
        $setOnInsert: {
          deviceId: activity.deviceId,
          firstSeenAt: activity.at,
        },
        $set: {
          ...activity.device,
          ipAddress: activity.ipAddress,
          lastSeenAt: activity.at,
          lastAction: activity.action,
        },
        $inc: {
          actionCount: 1,
          [actionCounter]: 1,
        },
        $push: {
          actions: {
            $each: [activity.event],
            $slice: -40,
          },
        },
      },
      { upsert: true },
    )

    return collection.findOne({ deviceId: activity.deviceId }, { projection: { _id: 0 } })
  }

  async findAll() {
    const collection = await this.collection()
    return collection.find({}, { projection: { _id: 0 } }).sort({ lastSeenAt: -1 }).toArray()
  }
}

function createActivityRepository() {
  if (env.storageDriver === 'mongodb') {
    return new MongoActivityRepository()
  }

  return new JsonActivityRepository(new JsonFileStore(env.adminActivityFile))
}

export const activityRepository = createActivityRepository()
