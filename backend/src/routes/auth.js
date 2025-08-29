import { Router } from 'express'
import { login, registerUser } from '../controllers/authController.js'
import { auth, permit } from '../middleware/auth.js'

const router = Router()
router.post('/login', login)
router.post('/register', registerUser)

export default router
