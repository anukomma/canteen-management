import React from 'react'
import { studentCard, studentTx, studentRecharge } from '../components/api'

export default function Student(){
  const [card,setCard] = React.useState(null)
  const [tx,setTx] = React.useState([])
  const [amt,setAmt] = React.useState('')
  const load = async () => {
    const c = await studentCard()
    setCard(c)
    const t = await studentTx()
    setTx(t)
  }
  React.useEffect(()=>{ load() },[])

  const doRecharge = async () => {
    if(!amt) return
    const res = await studentRecharge(Number(amt))
    setAmt('')
    await load()
    alert(res.pendingApproval ? 'Recharge requested (awaiting approval)' : 'Recharged!')
  }

  if(!card) return <div style={{padding:20}}>Loading...</div>
  return (
    <div style={{padding:20, fontFamily:'sans-serif'}}>
      <h2>My Meal Card</h2>
      <div style={{background:'#f7f7f7', padding:16, borderRadius:12, display:'inline-block'}}>
        <div><b>Card ID:</b> {card._id}</div>
        <div><b>Status:</b> {card.status}</div>
        <div><b>Balance:</b> ₹{card.balance}</div>
      </div>

      <div style={{marginTop:16}}>
        <input placeholder="Recharge amount" value={amt} onChange={e=>setAmt(e.target.value)} />
        <button onClick={doRecharge}>Recharge</button>
      </div>

      <h3 style={{marginTop:24}}>Transactions</h3>
      <table border="1" cellPadding="6" style={{borderCollapse:'collapse', width:'100%'}}>
        <thead><tr><th>Type</th><th>Amount</th><th>Approved</th><th>At</th></tr></thead>
        <tbody>
          {tx.map(t => (
            <tr key={t._id}>
              <td>{t.type}</td>
              <td>{t.amount}</td>
              <td>{t.approved ? 'Yes' : 'No'}</td>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
