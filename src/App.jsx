import { useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { mockUsers } from './data/mockUsers'
import { validateEmail, validateMfa, validatePassword } from './utils/validators'

const initialLogin = { email: '', password: '' }
const initialMfa = { code: '' }

function App() {
  const [view, setView] = useState('login')
  const [loginForm, setLoginForm] = useState(initialLogin)
  const [mfaForm, setMfaForm] = useState(initialMfa)
  const [errors, setErrors] = useState({})
  const [session, setSession] = useState(null)
  const [authMessage, setAuthMessage] = useState('')
  const [demoNotice, setDemoNotice] = useState('')

  const mockUserMap = useMemo(
    () => Object.fromEntries(mockUsers.map((user) => [user.email, user])),
    [],
  )

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleMfaChange = (event) => {
    const { name, value } = event.target
    setMfaForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {
      email: validateEmail(loginForm.email),
      password: validatePassword(loginForm.password),
    }

    const hasErrors = Object.values(nextErrors).some(Boolean)
    if (hasErrors) {
      setErrors(nextErrors)
      setAuthMessage('Please fix the validation issues and try again.')
      return
    }

    const matchedUser = mockUserMap[loginForm.email.trim().toLowerCase()]
    if (!matchedUser || matchedUser.password !== loginForm.password) {
      setErrors({
        email: 'Invalid email or password.',
        password: 'Invalid email or password.',
      })
      setAuthMessage('Those credentials do not match our mock users.')
      return
    }

    setSession({ user: matchedUser, authenticated: true, mfaVerified: false })
    setAuthMessage('')
    setDemoNotice(`Demo user ready: ${matchedUser.name} (${matchedUser.role})`)
    setView('mfa')
  }

  const handleMfaSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {
      code: validateMfa(mfaForm.code),
    }

    if (nextErrors.code) {
      setErrors(nextErrors)
      setAuthMessage('MFA code is missing or incomplete.')
      return
    }

    if (mfaForm.code.trim() !== session?.user.mfaCode) {
      setErrors({ code: 'The MFA code is incorrect.' })
      setAuthMessage('MFA validation failed. Please try the mock code again.')
      return
    }

    setSession((current) => ({ ...current, mfaVerified: true }))
    setAuthMessage('')
    setView('protected')
  }

  const handleLogout = () => {
    setSession(null)
    setLoginForm(initialLogin)
    setMfaForm(initialMfa)
    setErrors({})
    setAuthMessage('')
    setDemoNotice('')
    setView('login')
  }

  const isReadOnly = session?.user.role === 'read-only'

  const renderLogin = () => (
    <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: 480 }}>
      <div className="card-body p-4 p-md-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-1">Welcome back</h2>
          <p className="text-muted mb-0">Sign in to continue</p>
        </div>

        {authMessage && (
          <div className="alert alert-danger" role="alert">
            {authMessage}
          </div>
        )}

        {demoNotice && (
          <div className="alert alert-info" role="alert">
            {demoNotice}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="name@example.com"
              value={loginForm.email}
              onChange={handleLoginChange}
              autoComplete="email"
            />
            {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
              value={loginForm.password}
              onChange={handleLoginChange}
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Continue to MFA
          </button>

          <div className="text-center">
            <span className="text-muted">Need an account?</span>{' '}
            <button
              type="button"
              className="btn btn-link p-0 align-baseline"
              onClick={() => {
                setErrors({})
                setAuthMessage('')
                setView('signup')
              }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const renderSignup = () => (
    <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: 480 }}>
      <div className="card-body p-4 p-md-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Create account</h2>
            <p className="text-muted mb-0">This is a mock sign-up flow</p>
          </div>
        </div>

        <div className="alert alert-warning" role="alert">
          Full registration is not required for this exercise. This screen simulates the signup entry flow.
        </div>

        <button type="button" className="btn btn-primary w-100 mb-3" onClick={() => setView('login')}>
          Back to login
        </button>
      </div>
    </div>
  )

  const renderMfa = () => (
    <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: 480 }}>
      <div className="card-body p-4 p-md-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-1">Multi-factor authentication</h2>
          <p className="text-muted mb-0">Enter the code sent to your device</p>
        </div>

        {authMessage && (
          <div className="alert alert-danger" role="alert">
            {authMessage}
          </div>
        )}

        <div className="alert alert-light border mb-3" role="alert">
          Mock MFA code for {session?.user.name}: <strong>{session?.user.mfaCode}</strong>
        </div>

        <form onSubmit={handleMfaSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="mfaCode" className="form-label">MFA code</label>
            <input
              id="mfaCode"
              name="code"
              type="text"
              inputMode="numeric"
              className={`form-control ${errors.code ? 'is-invalid' : ''}`}
              placeholder="Enter 6-digit code"
              value={mfaForm.code}
              onChange={handleMfaChange}
            />
            {errors.code && <div className="invalid-feedback d-block">{errors.code}</div>}
          </div>

          <button type="submit" className="btn btn-success w-100 mb-3">
            Verify MFA
          </button>
          <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setView('login')}>
            Back to login
          </button>
        </form>
      </div>
    </div>
  )

  const renderProtected = () => (
    <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: 900 }}>
      <div className="card-body p-4 p-md-5">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <p className="text-uppercase text-muted small mb-1">Protected screen</p>
            <h2 className="fw-bold mb-0">Welcome, {session?.user.name}</h2>
          </div>
          <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
            Log out
          </button>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="border rounded-3 p-3 h-100">
              <p className="text-muted small mb-1">Role</p>
              <h4 className="mb-0 text-capitalize">{session?.user.role}</h4>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded-3 p-3 h-100">
              <p className="text-muted small mb-1">Status</p>
              <h4 className="mb-0">Authenticated and verified</h4>
            </div>
          </div>
        </div>

        <div className="border rounded-3 p-3 mb-3">
          <h4 className="mb-3">Account overview</h4>
          <p className="mb-0 text-muted">
            {isReadOnly
              ? 'You are in read-only mode. Editing is disabled for this account.'
              : 'You are in read/write mode. Editing is enabled for this account.'}
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button type="button" className="btn btn-primary" disabled={isReadOnly}>
            Edit profile
          </button>
          <button type="button" className="btn btn-secondary" disabled={isReadOnly}>
            Save changes
          </button>
          <button type="button" className="btn btn-outline-primary">
            View activity
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center px-3 py-5">
      <div className="w-100" style={{ maxWidth: 980 }}>
        {view === 'login' && renderLogin()}
        {view === 'signup' && renderSignup()}
        {view === 'mfa' && renderMfa()}
        {view === 'protected' && renderProtected()}
      </div>
    </div>
  )
}

export default App
