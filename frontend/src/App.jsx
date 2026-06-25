import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Leaves from './pages/Leaves'
import Payroll from './pages/Payroll'
import EmployeeDashboard from './pages/EmployeeDashboard'
import EmployeeLeaves from './pages/EmployeeLeaves'
import EmployeePayroll from './pages/EmployeePayroll'
import EmployeeAttendance from './pages/EmployeeAttendance'
import EmployeeHolidays from './pages/EmployeeHolidays'
import Attendance from './pages/Attendance'
import Holidays from './pages/Holidays'
import Departments from './pages/Departments'
import Designations from './pages/Designations'
import LeaveTypes from './pages/LeaveTypes'
import Reports from './pages/Reports'
import MainLayout from './layouts/MainLayout'
import EmployeeLayout from './pages/EmployeeLayout'
import './App.css'

function App() {
  const [authState, setAuthState] = useState(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    return { isAuthenticated, user }
  })

  useEffect(() => {
    const handleStorageChange = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      setAuthState({ isAuthenticated, user })
    }

    window.addEventListener('storage', handleStorageChange)

    window.addEventListener('focus', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleStorageChange)
    }
  }, [])

  const { isAuthenticated, user } = authState
  const userRole = user?.role

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {isAuthenticated && userRole === 'ADMIN' ? (
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="holidays" element={<Holidays />} />
          <Route path="departments" element={<Departments />} />
          <Route path="designations" element={<Designations />} />
          <Route path="leave-types" element={<LeaveTypes />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      ) : isAuthenticated && userRole === 'EMPLOYEE' ? (
        <Route path="/" element={<EmployeeLayout />}>
          <Route index element={<Navigate to="/employee-dashboard" replace />} />
          <Route path="employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="employee-leaves" element={<EmployeeLeaves />} />
          <Route path="employee-payroll" element={<EmployeePayroll />} />
          <Route path="employee-attendance" element={<EmployeeAttendance />} />
          <Route path="employee-holidays" element={<EmployeeHolidays />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  )
}

export default App
