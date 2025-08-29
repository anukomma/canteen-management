import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Admin from './pages/Admin.jsx'
import Manager from './pages/Manager.jsx'
import Cashier from './pages/Cashier.jsx'
import Student from './pages/Student.jsx'

const getUser = () => {
  try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
}
const Private = ({ roles, children }) => {
  const user = getUser()
  if(!user) return <Navigate to="/login" />
  if(roles && !roles.includes(user.role)) return <Navigate to="/login" />
  return children
}

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Private roles={['admin']}><Admin/></Private>} />
        <Route path="/manager" element={<Private roles={['manager','admin']}><Manager/></Private>} />
        <Route path="/cashier" element={<Private roles={['cashier','manager','admin']}><Cashier/></Private>} />
        <Route path="/student" element={<Private roles={['student']}><Student/></Private>} />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
