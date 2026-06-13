import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Lightbulb,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react'
import { useUIStore } from '../../store/uiStore'
import { useAuth } from '../../context/AuthContext'
import { ROUTES } from '../../constants'

/**
 * Sidebar component
 */
export const Sidebar = () => {
  const location = useLocation()
  const { isSidebarOpen } = useUIStore()
  const { logout } = useAuth()

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: ROUTES.DASHBOARD },
    { label: 'Journal', icon: BookOpen, href: ROUTES.JOURNAL },
    { label: 'Recommendations', icon: Lightbulb, href: ROUTES.RECOMMENDATIONS },
    { label: 'Analytics', icon: BarChart3, href: ROUTES.DASHBOARD } // Placeholder
  ]

  const isActive = (href) => location.pathname === href

  if (!isSidebarOpen) return null

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-soft">
      <div className="h-screen overflow-y-auto flex flex-col">
        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${
                    active
                      ? 'bg-primary-600 text-white shadow-soft'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-all">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
