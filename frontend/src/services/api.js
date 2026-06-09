const API_BASE_URL = 'https://api.fhgbase.com/api'

export const api = {
  async register(email, password, username) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '注册失败')
    }

    return data.data
  },

  async login(email, password, rememberMe = false) {
    const response = await fetch(`${API_BASE_URL}/auth/login?rememberMe=${rememberMe}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '登录失败')
    }

    return data.data
  },
}
