import { Router } from 'express'
import { auth, permit } from '../middleware/auth.js'
import { dashboard } from '../controllers/adminController.js'

import { listPendingUsers, approveUser, rejectUser } from '../controllers/adminController.js'






const router = Router()
router.get('/dashboard', auth, permit('admin'), dashboard)
router.get('/pending-users', listPendingUsers)
router.post('/approve-user/:id', approveUser)
router.post('/reject-user/:id', rejectUser)

export default router
