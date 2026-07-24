import { Router } from 'express'
import {
  createRecord,
  deleteRecord,
  getRecord,
  listRecords,
  updateRecord,
} from '../controllers/patientRecords.controller.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const patientRecordsRouter = Router()

patientRecordsRouter.get('/', asyncHandler(listRecords))
patientRecordsRouter.post('/', asyncHandler(createRecord))
patientRecordsRouter.get('/:id', asyncHandler(getRecord))
patientRecordsRouter.put('/:id', asyncHandler(updateRecord))
patientRecordsRouter.delete('/:id', asyncHandler(deleteRecord))
