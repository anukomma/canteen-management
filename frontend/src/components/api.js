const API = import.meta.env.VITE_API || 'http://localhost:4000/api'
const token = () => JSON.parse(localStorage.getItem('token') || 'null')
const hdrs = () => token() ? { 'Content-Type':'application/json', Authorization: 'Bearer ' + token() } : { 'Content-Type':'application/json' }

export const login = async (email,password) => {
  const res = await fetch(API + '/auth/login', { method:'POST', headers: hdrs(), body: JSON.stringify({ email, password }) })
  if(!res.ok) throw new Error('Login failed')
  return res.json()
}

export const adminDashboard = async () => (await fetch(API + '/admin/dashboard', { headers: hdrs() })).json()
export const pendingRecharges = async () => (await fetch(API + '/manager/recharges', { headers: hdrs() })).json()
export const approveRecharge = async (id) => (await fetch(API + '/manager/recharges/'+id+'/approve', { method:'POST', headers: hdrs() })).json()
export const studentCard = async () => (await fetch(API + '/student/card', { headers: hdrs() })).json()
export const studentTx = async () => (await fetch(API + '/student/transactions', { headers: hdrs() })).json()
export const studentRecharge = async (amount) => (await fetch(API + '/student/recharge', { method:'POST', headers: hdrs(), body: JSON.stringify({ amount }) })).json()
export const purchase = async (cardId, amount) => (await fetch(API + '/cashier/purchase', { method:'POST', headers: hdrs(), body: JSON.stringify({ cardId, amount }) })).json()
export const pendingUsers = async () =>
  (await fetch(API + '/admin/pending-users', { headers: hdrs() })).json()

export const approveUserApi = async (id) =>
  (await fetch(API + '/admin/approve-user/' + id, { method: 'POST', headers: hdrs() })).json()

export const rejectUserApi = async (id) =>
  (await fetch(API + '/admin/reject-user/' + id, { method: 'POST', headers: hdrs() })).json()
