import User from '../models/User.js'
import MealCard from '../models/MealCard.js'
import Transaction from '../models/Transaction.js'

export const listPendingUsers = async (req, res) => {
  const users = await User.find({ pending: true })
  res.json(users)
}

export const approveUser = async (req, res) => {
  const { id } = req.params
  await User.findByIdAndUpdate(id, { pending: false })
  res.json({ success: true })
}

export const rejectUser = async (req, res) => {
  const { id } = req.params
  await User.findByIdAndDelete(id)
  res.json({ success: true })
}

export const dashboard = async (req,res) => {
  const totalStudents = await User.countDocuments({ role: 'student' })
  const totalStaff = await User.countDocuments({ role: { $in: ['manager','cashier'] } })
  const totals = await MealCard.aggregate([ { $group: { _id: null, totalBalance: { $sum: '$balance' } } } ])
  const totalBalance = totals[0]?.totalBalance || 0
  const lastTx = await Transaction.find().sort({ createdAt: -1 }).limit(10).lean()
  res.json({ totalStudents, totalStaff, totalBalance, recentTransactions: lastTx })
}