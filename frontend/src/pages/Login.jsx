import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
    
    if (message.text) {
      setMessage({ type: '', text: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await authService.login({
        email: formData.email.trim(),
        password: formData.password,
      })

      if (response.data.success) {
        
        const userData = response.data.data
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(userData))

        setMessage({ type: 'success', text: 'Login successful! Redirecting...' })

        setTimeout(() => {
          if (userData.role === 'ADMIN') {
            window.location.href = '/dashboard'
          } else {
            window.location.href = '/employee-dashboard'
          }
        }, 1000)
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Login failed' })
      }
    } catch (error) {
      let errorMessage = 'An error occurred during login'
      
      if (error.response) {
        
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`
      } else if (error.request) {
        
        errorMessage = 'Network error: Unable to connect to server. Please check if the backend is running.'
      } else {
        
        errorMessage = error.message || 'An unexpected error occurred'
      }
      
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}
    >
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', border: 'none' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="card-title mb-2" style={{ fontFamily: "'Source Serif 4', serif", color: '#2F3C7E', fontWeight: 600 }}>HR Management System</h2>
            <p className="text-muted" style={{ fontSize: '0.9375rem' }}>Sign in to your account</p>
          </div>

          {message.text && (
            <div
              className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}
              role="alert"
            >
              {message.text}
              <button
                type="button"
                className="btn-close"
                onClick={() => setMessage({ type: '', text: '' })}
                aria-label="Close"
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
