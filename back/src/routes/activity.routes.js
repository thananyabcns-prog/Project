import { Router } from 'express'
import { createActivity, listAdminActivity } from '../controllers/activity.controller.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const activityRouter = Router()

activityRouter.post('/activity', asyncHandler(createActivity))
activityRouter.get('/admin/activity', asyncHandler(listAdminActivity))
