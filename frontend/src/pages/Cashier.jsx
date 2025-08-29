import React from 'react'
import { purchase } from '../components/api'

export default function Cashier(){
  const [cardId,setCardId] = React.useState('')
  const [amount,setAmount] = React.useState('')
  const [msg,setMsg] = React.useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    if(!cardId || !amount) return setMsg('Enter cardId and amount')
    try{
      const data = await purchase(cardId, Number(amount))
      setMsg('Success. New balance: ₹' + data.balance)
    }catch(e){
      setMsg('Error making purchase')
    }
  }

  return (
    <div style={{padding:20, fontFamily:'sans-serif'}}>
      <h2>Cashier POS</h2>
      <form onSubmit={submit} style={{display:'flex', gap:8, alignItems:'center'}}>
        <input placeholder="MealCard ID" value={cardId} onChange={e=>setCardId(e.target.value)} />
        <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button>Charge</button>
      </form>
      <div style={{marginTop:12}}>{msg}</div>
      <p style={{marginTop:16, fontSize:12}}>Tip: Find Card ID from Student view or DB.</p>
    </div>
  )
}
