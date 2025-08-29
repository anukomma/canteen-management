import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import MealCard from '../models/MealCard.js'

const sign = (user) => jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2d' })

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email & password required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  // const isMatch = await user.comparePassword(password);
  // if (!isMatch) {
  //   return res.status(401).json({ error: 'Invalid password' });
  // }


  const token = sign(user);

  let card = null;
  if (user.role === 'student') {
    card = await MealCard.findOne({ studentId: user._id });
  }

  res.json({
    token,
    user: {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    },
    card,
  });
};


export const registerUser = async (req,res) => {
  const { name, email, password, role } = req.body
  if(!name || !email || !password || !role) return res.status(400).json({ error: 'Missing fields' })
  const exists = await User.findOne({ email })
  if(exists) return res.status(409).json({ error: 'Email already used' })
  const pending = role !== 'admin'
  const user = await User.create({ name, email, password, role, pending })
  const token = sign(user)
  if(role === 'student'){
    await MealCard.create({ studentId: user._id, balance: 0 })
  }
  res.status(201).json({ id: user._id, pending })
}
