import { assertAdminPassword, listActivity, trackActivity } from '../services/activity.service.js'

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || ''
}

export async function createActivity(req, res) {
  const activity = await trackActivity(req.body, {
    ip: getClientIp(req),
    path: req.originalUrl,
  })

  res.status(201).json({ data: activity })
}

export async function listAdminActivity(req, res) {
  assertAdminPassword(req.headers['x-admin-password'] || '')
  const activity = await listActivity()

  res.json({
    data: activity,
    summary: {
      devices: activity.length,
      activeToday: activity.filter((record) => {
        if (!record.lastSeenAt) {
          return false
        }

        const lastSeenDate = new Date(record.lastSeenAt)
        const today = new Date()

        return lastSeenDate.toDateString() === today.toDateString()
      }).length,
      saves: activity.reduce((total, record) => total + (record.saveCount || 0), 0),
      prints: activity.reduce((total, record) => total + (record.printCount || 0), 0),
    },
  })
}
