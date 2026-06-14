import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Lightbulb
} from 'lucide-react'
import { useUIStore } from '../../store/uiStore'
import { ROUTES } from '../../constants'

/**
 * Sidebar component
 */
export const Sidebar = () => {
  const location = useLocation()
  const { isSidebarOpen } = useUIStore()

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: ROUTES.DASHBOARD },
    { label: 'Journal', icon: BookOpen, href: ROUTES.JOURNAL },
    { label: 'Recommendations', icon: Lightbulb, href: ROUTES.RECOMMENDATIONS }
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
      </div>
    </aside>
  )
}
