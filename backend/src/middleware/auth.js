import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const auth = (req,res,next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if(!token) return res.status(401).json({ error: 'No token' })
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  }catch(e){
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export const permit = (...roles) => (req,res,next) => {
  if(!req.user || !roles.includes(req.user.role)){
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}
