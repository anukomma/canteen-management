import mongoose from 'mongoose'

const TransactionSchema = new mongoose.Schema({
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'MealCard', required: true, index: true },
  type: { type: String, enum: ['recharge','purchase'], required: true },
  amount: { type: Number, required: true },
  mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
  approved: { type: Boolean, default: true }, // manager approval if needed
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requestId: { type: String, unique: true }, // idempotency to prevent duplicates
}, { timestamps: true })

export default mongoose.model('Transaction', TransactionSchema)
