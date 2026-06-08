import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginSuccess, setLoading, setError } from '@/store/slices/authSlice'
import { api } from '@/services/api'
import { validateEmail, validatePassword, getPasswordStrength, validateUsername } from '@/utils/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/ui/PasswordInput'
import Card from '@/components/ui/Card'

const RegisterForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

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

    const usernameError = validateUsername(formData.username)
    if (usernameError) {
      newErrors.username = usernameError
    }

    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
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
      const response = await api.register(
        formData.email,
        formData.password,
        formData.username
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

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <Card padding="xl" className="w-full max-w-md animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">创建账号</h1>
        <p className="text-gray-400">开始你的旅程</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <Input
          label="用户名"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="john_doe"
          error={errors.username}
          autoComplete="username"
        />

        <PasswordInput
          label="密码"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.password}
          showStrength={formData.password.length > 0}
          strength={passwordStrength}
          autoComplete="new-password"
        />

        <PasswordInput
          label="确认密码"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        {errors.submit && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {errors.submit}
          </div>
        )}

        <Button
          type="submit"
          className="w-full glow"
        >
          注 册
        </Button>
      </form>

      <p className="mt-8 text-center text-gray-400">
        已有账号？{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
          立即登录
        </Link>
      </p>
    </Card>
  )
}

export default RegisterForm
