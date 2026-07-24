import {
  createPatientRecord,
  deletePatientRecord,
  getPatientRecord,
  listPatientRecords,
  updatePatientRecord,
} from '../services/patientRecords.service.js'

export async function listRecords(req, res) {
  const records = await listPatientRecords({ search: req.query.search || '' })
  res.json({ data: records })
}

export async function getRecord(req, res) {
  const record = await getPatientRecord(req.params.id)
  res.json({ data: record })
}

export async function createRecord(req, res) {
  const record = await createPatientRecord(req.body)
  res.status(201).json({ data: record })
}

export async function updateRecord(req, res) {
  const record = await updatePatientRecord(req.params.id, req.body)
  res.json({ data: record })
}

export async function deleteRecord(req, res) {
  await deletePatientRecord(req.params.id)
  res.status(204).send()
}
