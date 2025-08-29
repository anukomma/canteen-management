import React from 'react'
import { adminDashboard, pendingUsers, approveUserApi, rejectUserApi } from '../components/api'

export default function Admin() {
  const [data, setData] = React.useState(null)
  const [pending, setPending] = React.useState([])

  React.useEffect(() => {
    adminDashboard().then(setData)
    pendingUsers().then(setPending)
  }, [])

  const approve = async (id) => {
    await approveUserApi(id)
    setPending(p => p.filter(u => u._id !== id)) // remove from list
  }

  const reject = async (id) => {
    await rejectUserApi(id)
    setPending(p => p.filter(u => u._id !== id)) // remove from list
  }

  if (!data) return <div style={{ padding: 20 }}>Loading...</div>

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <Card title="Total Students" value={data.totalStudents} />
        <Card title="Total Staff" value={data.totalStaff} />
        <Card title="Total Balance (₹)" value={data.totalBalance} />
      </div>

      <h3 style={{ marginTop: 24 }}>Recent Transactions</h3>
      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead><tr><th>Type</th><th>Amount</th><th>Approved</th><th>At</th></tr></thead>
        <tbody>
          {data.recentTransactions.map(t => (
            <tr key={t._id}>
              <td>{t.type}</td>
              <td>{t.amount}</td>
              <td>{t.approved ? 'Yes' : 'No'}</td>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 24 }}>Pending Role Requests</h3>
      {pending.length === 0 ? <p>No pending users</p> : (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {pending.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => approve(u._id)} style={{ marginRight: 8 }}>Approve</button>
                  <button onClick={() => reject(u._id)} style={{ background: 'red', color: 'white' }}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const Card = ({ title, value }) => (
  <div style={{ background: '#f7f7f7', padding: 16, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
    <div style={{ fontSize: 12, color: '#666' }}>{title}</div>
    <div style={{ fontSize: 24, fontWeight: 'bold' }}>{value}</div>
  </div>
)
