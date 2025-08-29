import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  pending: { type: Boolean, default: true },
  role: { type: String, enum: ['admin','manager','cashier','student'], required: true },
}, { timestamps: true })

UserSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = function(candidate){
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', UserSchema)
