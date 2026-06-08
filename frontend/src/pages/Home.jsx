import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/store/slices/authSlice'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">My Website</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              欢迎, {user?.username || user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              登出
            </Button>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto">
        <Card padding="xl" className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            欢迎来到你的个人空间
          </h2>
          <p className="text-gray-400 mb-6">
            这是登录后的首页。后续功能将在这里添加。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card padding="lg" className="hover:border-primary-500/50 transition-colors cursor-pointer">
              <div className="text-primary-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">个人资料</h3>
              <p className="text-sm text-gray-400">管理你的个人信息</p>
            </Card>

            <Card padding="lg" className="hover:border-primary-500/50 transition-colors cursor-pointer">
              <div className="text-primary-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">作品集</h3>
              <p className="text-sm text-gray-400">展示你的项目作品</p>
            </Card>

            <Card padding="lg" className="hover:border-primary-500/50 transition-colors cursor-pointer">
              <div className="text-primary-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">博客</h3>
              <p className="text-sm text-gray-400">分享你的想法和见解</p>
            </Card>
          </div>
        </Card>

        {/* User info card */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold text-white mb-4">账号信息</h3>
          <div className="space-y-3">
            <div className="flex">
              <span className="text-gray-400 w-24">ID:</span>
              <span className="text-gray-200">{user?.id}</span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-24">邮箱:</span>
              <span className="text-gray-200">{user?.email}</span>
            </div>
            <div className="flex">
              <span className="text-gray-400 w-24">用户名:</span>
              <span className="text-gray-200">{user?.username}</span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}

export default Home
