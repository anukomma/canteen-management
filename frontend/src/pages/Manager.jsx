import React from 'react'
import { pendingRecharges, approveRecharge } from '../components/api'

export default function Manager(){
  const [items,setItems] = React.useState([])
  const load = () => pendingRecharges().then(setItems)
  React.useEffect(load,[])
  const approve = async (id) => {
    await approveRecharge(id)
    load()
  }
  return (
    <div style={{padding:20, fontFamily:'sans-serif'}}>
      <h2>Manager Panel</h2>
      <h3>Pending Recharge Requests</h3>
      <table border="1" cellPadding="6" style={{borderCollapse:'collapse', width:'100%'}}>
        <thead><tr><th>ID</th><th>Amount</th><th>Requested At</th><th>Action</th></tr></thead>
        <tbody>
          {items.map(r=> (
            <tr key={r._id}>
              <td>{r._id}</td>
              <td>{r.amount}</td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
              <td><button onClick={()=>approve(r._id)}>Approve</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
