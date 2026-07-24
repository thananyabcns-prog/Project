import { randomUUID } from 'node:crypto'
import { HttpError } from '../utils/httpError.js'
import { patientRecordsRepository } from '../repositories/patientRecords.repository.js'

function normalizeText(value) {
  return String(value || '').trim().toLowerCase()
}

function assertRecordPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new HttpError(400, 'Request body is required')
  }

  if (!payload.form || typeof payload.form !== 'object') {
    throw new HttpError(400, 'Field "form" is required')
  }

  if (!payload.checks || typeof payload.checks !== 'object') {
    throw new HttpError(400, 'Field "checks" is required')
  }
}

function matchesSearch(record, search) {
  const form = record.form || {}
  const searchableText = [
    form.patientName,
    form.hn,
    form.an,
    form.procedure,
    form.ward,
    record.createdAt,
    record.updatedAt,
  ]
    .map(normalizeText)
    .join(' ')

  return searchableText.includes(normalizeText(search))
}

export async function listPatientRecords({ search = '' } = {}) {
  const records = await patientRecordsRepository.findAll()

  if (!search.trim()) {
    return records
  }

  return records.filter((record) => matchesSearch(record, search))
}

export async function getPatientRecord(id) {
  const record = await patientRecordsRepository.findById(id)

  if (!record) {
    throw new HttpError(404, 'Patient record not found')
  }

  return record
}

export async function createPatientRecord(payload) {
  assertRecordPayload(payload)

  const now = new Date().toISOString()
  const record = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    form: payload.form,
    checks: payload.checks,
  }

  return patientRecordsRepository.create(record)
}

export async function updatePatientRecord(id, payload) {
  assertRecordPayload(payload)

  const updatedRecord = await patientRecordsRepository.update(id, {
    updatedAt: new Date().toISOString(),
    form: payload.form,
    checks: payload.checks,
  })

  if (!updatedRecord) {
    throw new HttpError(404, 'Patient record not found')
  }

  return updatedRecord
}

export async function deletePatientRecord(id) {
  const deleted = await patientRecordsRepository.delete(id)

  if (!deleted) {
    throw new HttpError(404, 'Patient record not found')
  }
}
