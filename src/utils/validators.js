export function validateEmail(email) {
  if (!email.trim()) {
    return 'Email is required.'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address.'
  }

  return ''
}

export function validatePassword(password) {
  if (!password) {
    return 'Password is required.'
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  return ''
}

export function validateMfa(code) {
  if (!code.trim()) {
    return 'MFA code is required.'
  }

  if (code.trim().length < 6) {
    return 'MFA code must be 6 digits.'
  }

  return ''
}
