// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import { login as doLogin } from '../components/api'

// export default function Login(){
//   const [email,setEmail] = React.useState('alice@student.edu')
//   const [password,setPassword] = React.useState('alice123')
//   const [err,setErr] = React.useState('')
//   const nav = useNavigate()

//   const submit = async (e) => {
//     e.preventDefault()
//     try{
//       const data = await doLogin(email, password)
//       localStorage.setItem('token', JSON.stringify(data.token))
//       localStorage.setItem('user', JSON.stringify(data.user))
//       if(data.user.role === 'admin') nav('/admin')
//       else if(data.user.role === 'manager') nav('/manager')
//       else if(data.user.role === 'cashier') nav('/cashier')
//       else nav('/student')
//     }catch(e){
//       setErr('Login failed')
//     }
//   }

//   return (
//     <div style={{maxWidth:400, margin:'80px auto', fontFamily:'sans-serif'}}>
//       <h2>Meal Card Login</h2>
//       <form onSubmit={submit}>
//         <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" style={{width:'100%', padding:8}}/></div>
//         <div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" style={{width:'100%', padding:8, marginTop:8}}/></div>
//         <button style={{marginTop:12, padding:'8px 12px'}}>Login</button>
//         {err && <div style={{color:'red', marginTop:8}}>{err}</div>}
//         <p style={{marginTop:16, fontSize:12, color:'#555'}}>Try admin@uni.edu / admin123, manager@uni.edu / manager123, cashier@uni.edu / cashier123, alice@student.edu / alice123 (after running seed)</p>
//       </form>
//     </div>
//   )
// }


import React from 'react'
import { useNavigate } from 'react-router-dom'
import { login as doLogin } from '../components/api'

const API = import.meta.env.VITE_API || 'http://localhost:4000/api'

export default function Login(){
  const [email,setEmail] = React.useState('alice@student.edu')
  const [password,setPassword] = React.useState('alice123')
  const [err,setErr] = React.useState('')
  const [regMode,setRegMode] = React.useState(false)
  const [name,setName] = React.useState('')
  const [role,setRole] = React.useState('student')
  const [regMsg,setRegMsg] = React.useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try{
      const data = await doLogin(email, password)
      localStorage.setItem('token', JSON.stringify(data.token))
      localStorage.setItem('user', JSON.stringify(data.user))
      if(data.user.role === 'admin') nav('/admin')
      else if(data.user.role === 'manager') nav('/manager')
      else if(data.user.role === 'cashier') nav('/cashier')
      else nav('/student')
    }catch(e){
      if(e?.message?.includes('pending')) setErr('Account pending admin approval')
      else setErr('Login failed')
    }
  }

  const register = async (e) => {
    e.preventDefault()
    setErr('')
    setRegMsg('')
    try{
      const res = await fetch(API + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })
      const data = await res.json()
      if(!res.ok) throw new Error(data.error || 'Registration failed')
      if(data.pending){
        setRegMsg('Registration submitted. Await admin approval.')
      }else{
        setRegMsg('Registered! You can now login.')
      }
      setRegMode(false)
      setName('')
      setEmail('')
      setPassword('')
      setRole('student')
    }catch(e){
      setErr(e.message)
    }
  }

  return (
    <div style={{maxWidth:400, margin:'80px auto', fontFamily:'sans-serif'}}>
      <h2>Meal Card {regMode ? 'Register' : 'Login'}</h2>
      {regMode ? (
        <form onSubmit={register}>
          <div><input value={name} onChange={e=>setName(e.target.value)} placeholder="name" style={{width:'100%', padding:8}}/></div>
          <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" style={{width:'100%', padding:8, marginTop:8}}/></div>
          <div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" style={{width:'100%', padding:8, marginTop:8}}/></div>
          <div>
            <select value={role} onChange={e=>setRole(e.target.value)} style={{width:'100%', padding:8, marginTop:8}}>
              <option value="student">Student</option>
              <option value="manager">Manager</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>
          <button style={{marginTop:12, padding:'8px 12px'}}>Register</button>
          <div style={{marginTop:8}}>
            <span style={{color:'#555', cursor:'pointer'}} onClick={()=>setRegMode(false)}>Already have an account? Login</span>
          </div>
        </form>
      ) : (
        <form onSubmit={submit}>
          <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" style={{width:'100%', padding:8}}/></div>
          <div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" style={{width:'100%', padding:8, marginTop:8}}/></div>
          <button style={{marginTop:12, padding:'8px 12px'}}>Login</button>
          <div style={{marginTop:8}}>
            <span style={{color:'#555', cursor:'pointer'}} onClick={()=>setRegMode(true)}>New user? Register</span>
          </div>
        </form>
      )}
      {err && <div style={{color:'red', marginTop:8}}>{err}</div>}
      {regMsg && <div style={{color:'green', marginTop:8}}>{regMsg}</div>}
      {!regMode && (
        <p style={{marginTop:16, fontSize:12, color:'#555'}}>
          Try admin@uni.edu / admin123, manager@uni.edu / manager123, cashier@uni.edu / cashier123, alice@student.edu / alice123 (after running seed)
        </p>
      )}
    </div>
  )
}
