import { Router } from 'express'
import { auth, permit } from '../middleware/auth.js'
import { purchase } from '../controllers/cashierController.js'

const router = Router()
router.post('/purchase', auth, permit('cashier','manager','admin'), purchase)

export default router
