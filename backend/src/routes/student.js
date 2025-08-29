import { Router } from 'express'
import { auth, permit } from '../middleware/auth.js'
import { getCard, history, recharge } from '../controllers/studentController.js'

const router = Router()
router.get('/card', auth, permit('student'), getCard)
router.get('/transactions', auth, permit('student'), history)
router.post('/recharge', auth, permit('student'), recharge)

export default router
