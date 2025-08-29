import Transaction from '../models/Transaction.js'
import MealCard from '../models/MealCard.js'

export const listPendingRecharges = async (req,res) => {
  const pending = await Transaction.find({ type: 'recharge', approved: false }).sort({ createdAt: -1 }).lean()
  res.json(pending)
}

export const approveRecharge = async (req,res) => {
  const { id } = req.params
  const tx = await Transaction.findById(id)
  if(!tx || tx.type !== 'recharge') return res.status(404).json({ error: 'Recharge request not found' })
  if(tx.approved) return res.status(400).json({ error: 'Already approved' })
  const card = await MealCard.findById(tx.cardId)
  if(!card) return res.status(404).json({ error: 'Card not found' })
  card.balance += tx.amount
  await card.save()
  tx.approved = true
  tx.approvedBy = req.user.id
  await tx.save()
  res.json({ ok: true })
}
