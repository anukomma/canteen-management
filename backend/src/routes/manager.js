import { Router } from 'express'
import { auth, permit } from '../middleware/auth.js'
import { listPendingRecharges, approveRecharge } from '../controllers/managerController.js'

const router = Router()
router.get('/recharges', auth, permit('manager','admin'), listPendingRecharges)
router.post('/recharges/:id/approve', auth, permit('manager','admin'), approveRecharge)

export default router
