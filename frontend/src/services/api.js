import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      
      localStorage.removeItem('token')
      localStorage.removeItem('isAuthenticated')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const employeeService = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  getByEmail: (email) => api.get('/employees/by-email', { params: { email } }),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
}

export const leaveService = {
  getAll: () => api.get('/leaves'),
  getById: (id) => api.get(`/leaves/${id}`),
  getByEmployee: (employeeId) => api.get(`/leaves/employee/${employeeId}`),
  create: (data) => api.post('/leaves', data),
  update: (id, data) => api.put(`/leaves/${id}`, data),
  approve: (id) => api.put(`/leaves/${id}/approve`),
  reject: (id) => api.put(`/leaves/${id}/reject`),
}

export const payrollService = {
  getAll: () => api.get('/payroll'),
  getById: (id) => api.get(`/payroll/${id}`),
  getByEmployee: (employeeId) => api.get(`/payroll/employee/${employeeId}`),
  getByMonth: (month) => api.get(`/payroll/month/${month}`),
  getHistoryByEmployee: (employeeId) => api.get(`/payroll/history/employee/${employeeId}`),
  getHistoryByMonth: (month) => api.get(`/payroll/history/month/${month}`),
  getHistoryByYear: (year) => api.get(`/payroll/history/year/${year}`),
  create: (data) => api.post('/payroll', data),
  update: (id, data) => api.put(`/payroll/${id}`, data),
  delete: (id) => api.delete(`/payroll/${id}`),
  process: (id) => api.put(`/payroll/${id}/process`),
}

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    return Promise.resolve()
  },
  getCurrentUser: () => api.get('/auth/me'),
}

export const attendanceService = {
  getAll: () => api.get('/attendance'),
  getByEmployee: (employeeId) => api.get(`/attendance/employee/${employeeId}`),
  markAttendance: (data) => api.post('/attendance', data),
}

export const holidayService = {
  getAll: () => api.get('/holidays'),
  create: (data) => api.post('/holidays', data),
  delete: (id) => api.delete(`/holidays/${id}`),
}

export const departmentService = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
}

export const designationService = {
  getAll: () => api.get('/designations'),
  getById: (id) => api.get(`/designations/${id}`),
  create: (data) => api.post('/designations', data),
  update: (id, data) => api.put(`/designations/${id}`, data),
  delete: (id) => api.delete(`/designations/${id}`),
}

export const leaveTypeService = {
  getAll: () => api.get('/leave-types'),
  getById: (id) => api.get(`/leave-types/${id}`),
  create: (data) => api.post('/leave-types', data),
  update: (id, data) => api.put(`/leave-types/${id}`, data),
  delete: (id) => api.delete(`/leave-types/${id}`),
}

export const reportService = {
  getMonthlyPayrollSummary: () => api.get('/reports/payroll/monthly'),
  getLeaveSummary: () => api.get('/reports/leaves/summary'),
  getAttendanceSummary: () => api.get('/reports/attendance/summary'),
}

export default api

