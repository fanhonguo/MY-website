export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  const errors = []

  if (password.length < 8) {
    errors.push('密码至少需要8个字符')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含小写字母')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密码必须包含大写字母')
  }

  if (!/\d/.test(password)) {
    errors.push('密码必须包含数字')
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('密码必须包含特殊字符 (!@#$%^&*)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const getPasswordStrength = (password) => {
  let strength = 0

  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*]/.test(password)) strength++

  return strength
}

export const validateUsername = (username) => {
  if (username.length < 2) {
    return '用户名至少需要2个字符'
  }
  if (username.length > 50) {
    return '用户名最多50个字符'
  }
  return null
}
