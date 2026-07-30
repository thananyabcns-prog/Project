import { env } from '../config/env.js'
import { activityRepository } from '../repositories/activity.repository.js'
import { HttpError } from '../utils/httpError.js'

const allowedActions = new Set(['page_view', 'record_list_view', 'record_save', 'print_form'])

function cleanText(value, fallback = '') {
  return String(value || fallback).trim().slice(0, 500)
}

function cleanDevice(payload = {}) {
  return {
    deviceName: cleanText(payload.deviceName, 'Unknown device').slice(0, 120),
    deviceType: cleanText(payload.deviceType, 'unknown').slice(0, 40),
    browser: cleanText(payload.browser, 'Unknown browser').slice(0, 120),
    platform: cleanText(payload.platform, 'Unknown platform').slice(0, 120),
    screen: cleanText(payload.screen).slice(0, 60),
    language: cleanText(payload.language).slice(0, 40),
    timezone: cleanText(payload.timezone).slice(0, 80),
    userAgent: cleanText(payload.userAgent).slice(0, 500),
  }
}

export async function trackActivity(payload, requestMeta = {}) {
  if (!payload || typeof payload !== 'object') {
    throw new HttpError(400, 'Request body is required')
  }

  const deviceId = cleanText(payload.deviceId).slice(0, 120)
  const action = cleanText(payload.action).slice(0, 80)

  if (!deviceId) {
    throw new HttpError(400, 'deviceId is required')
  }

  if (!allowedActions.has(action)) {
    throw new HttpError(400, 'Unsupported activity action')
  }

  const now = new Date().toISOString()
  const page = cleanText(payload.page || requestMeta.path || '/').slice(0, 160)
  const event = {
    action,
    page,
    at: now,
  }

  const activity = {
    deviceId,
    action,
    at: now,
    device: cleanDevice(payload),
    ipAddress: cleanText(requestMeta.ip).slice(0, 80),
    event,
  }

  return activityRepository.track(activity)
}

export async function listActivity() {
  return activityRepository.findAll()
}

export function assertAdminPassword(password) {
  if (!env.adminPassword) {
    throw new HttpError(503, 'Admin password is not configured')
  }

  if (password !== env.adminPassword) {
    throw new HttpError(401, 'Invalid admin password')
  }
}
