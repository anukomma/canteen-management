import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import MealCard from '../models/MealCard.js'
import Meal from '../models/Meal.js'

dotenv.config()

async function run(){
  await mongoose.connect(process.env.MONGO_URI)
  await User.deleteMany({})
  await MealCard.deleteMany({})
  await Meal.deleteMany({})

  const admin = await User.create({ name: 'Admin', email: 'admin@uni.edu', password: 'admin123', role: 'admin' })
  const manager = await User.create({ name: 'Manager', email: 'manager@uni.edu', password: 'manager123', role: 'manager' })
  const cashier = await User.create({ name: 'Cashier', email: 'cashier@uni.edu', password: 'cashier123', role: 'cashier' })
  const student = await User.create({ name: 'Alice', email: 'alice@student.edu', password: 'alice123', role: 'student' })

  const card = await MealCard.create({ studentId: student._id, balance: 200 })

  await Meal.insertMany([
    { name: 'Veg Thali', price: 60 },
    { name: 'Paneer Wrap', price: 45 },
    { name: 'Masala Dosa', price: 50 },
    { name: 'Tea', price: 10 },
  ])

  console.log('Seeded users and data')
  await mongoose.disconnect()
}
run().catch(e=>{ console.error(e); process.exit(1) })
