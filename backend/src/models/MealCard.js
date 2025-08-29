import mongoose from 'mongoose'

const MealCardSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  balance: { type: Number, default: 0 },
  status: { type: String, enum: ['active','blocked'], default: 'active' },
  qrToken: { type: String }, // for QR flows
}, { timestamps: true })

export default mongoose.model('MealCard', MealCardSchema)
