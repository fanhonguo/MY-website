import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginSuccess, setLoading, setError } from '@/store/slices/authSlice'
import { api } from '@/services/api'
import { validateEmail } from '@/utils/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import Card from '@/components/ui/Card'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = '请输入邮箱'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '邮箱格式不正确'
    }

    if (!formData.password) {
      newErrors.password = '请输入密码'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    dispatch(setLoading(true))

    try {
      const response = await api.login(
        formData.email,
        formData.password,
        formData.rememberMe
      )

      dispatch(loginSuccess({
        user: response.user,
        accessToken: response.accessToken,
      }))

      navigate('/home')
    } catch (error) {
      dispatch(setError(error.message))
      setErrors({ submit: error.message })
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <Card padding="xl" className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">欢迎回来</h1>
        <p className="text-gray-400">登录你的账号</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="邮箱"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          error={errors.email}
          autoComplete="email"
        />

        <PasswordInput
          label="密码"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-white/20 bg-dark-800 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-400">记住我</span>
          </label>
          <a href="#" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
            忘记密码？
          </a>
        </div>

        {errors.submit && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {errors.submit}
          </div>
        )}

        <Button
          type="submit"
          className="w-full glow"
        >
          登 录
        </Button>
      </form>

      <p className="mt-8 text-center text-gray-400">
        还没有账号？{' '}
        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          立即注册
        </Link>
      </p>
    </Card>
  )
}

export default LoginForm
