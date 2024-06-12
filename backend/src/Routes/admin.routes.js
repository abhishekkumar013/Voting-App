import express from 'express'
import { verifyJwt } from '../middleware/auth.middleware.js'
import isAdmin from '../middleware/admin.middleware.js'
import { approveAdminRequest } from '../Controllers/admin.controller.js'

const router = express.Router()

router.route('/approve-request').patch(verifyJwt, isAdmin, approveAdminRequest)
export default router
