import MealCard from '../models/MealCard.js'
import Transaction from '../models/Transaction.js'
import { v4 as uuidv4 } from 'uuid'

const REQUIRE_MANAGER_APPROVAL = true // toggle to true to require approvals

export const getCard = async (req,res) => {
  const card = await MealCard.findOne({ studentId: req.user.id })
  if(!card) return res.status(404).json({ error: 'Card not found' })
  res.json(card)
}

export const history = async (req,res) => {
  const card = await MealCard.findOne({ studentId: req.user.id })
  if(!card) return res.status(404).json({ error: 'Card not found' })
  const tx = await Transaction.find({ cardId: card._id }).sort({ createdAt: -1 })
  res.json(tx)
}

export const recharge = async (req,res) => {
  const { amount } = req.body
  if(!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' })
  const card = await MealCard.findOne({ studentId: req.user.id })
  if(!card) return res.status(404).json({ error: 'Card not found' })

  const tx = await Transaction.create({
    cardId: card._id,
    type: 'recharge',
    amount,
    approved: !REQUIRE_MANAGER_APPROVAL,
    requestId: uuidv4()
  })

  if(!REQUIRE_MANAGER_APPROVAL){
    card.balance += amount
    await card.save()
  }

  res.json({ ok: true, pendingApproval: REQUIRE_MANAGER_APPROVAL, balance: card.balance, transaction: tx })
}
