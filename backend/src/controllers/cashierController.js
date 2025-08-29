import MealCard from '../models/MealCard.js'
import Transaction from '../models/Transaction.js'
import Meal from '../models/Meal.js'
import { v4 as uuidv4 } from 'uuid'

export const purchase = async (req,res) => {
  const { cardId, amount, mealId } = req.body
  if(!cardId || !amount) return res.status(400).json({ error: 'cardId & amount required' })
  const card = await MealCard.findById(cardId)
  if(!card) return res.status(404).json({ error: 'Card not found' })
  if(card.status !== 'active') return res.status(400).json({ error: 'Card not active' })

  let finalAmount = amount
  if(mealId){
    const meal = await Meal.findById(mealId)
    if(meal) finalAmount = meal.price
  }
  if(card.balance < finalAmount) return res.status(400).json({ error: 'Insufficient balance' })

  card.balance -= finalAmount
  await card.save()

  const tx = await Transaction.create({
    cardId: card._id, type: 'purchase', amount: finalAmount, mealId, requestId: uuidv4(), approved: true
  })
  res.json({ ok: true, transaction: tx, balance: card.balance })
}
