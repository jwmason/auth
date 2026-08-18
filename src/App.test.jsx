import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Auth flow', () => {
  test('shows validation errors for invalid login input', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /continue to mfa/i }))

    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })

  test('allows a valid user to complete login and MFA', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/email/i), 'viewer@demo.com')
    await user.type(screen.getByLabelText(/password/i), 'Viewer123!')
    await user.click(screen.getByRole('button', { name: /continue to mfa/i }))

    expect(screen.getByText(/multi-factor authentication/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/mfa code/i), '123456')
    await user.click(screen.getByRole('button', { name: /verify mfa/i }))

    expect(screen.getByText(/welcome, viewer demo/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /read-only/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit profile/i })).toBeDisabled()
  })
})
