import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Sun, Moon, BookOpen } from 'lucide-react'
import { Button, Typography } from '@/components/ui'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/', label: 'Runway' },
  { to: '/quarter', label: 'Quarter' },
  { to: '/allocate', label: 'Allocate' },
  { to: '/goals', label: 'Goals' },
  { to: '/giving', label: 'Giving' },
  { to: '/reimbursements', label: 'Reimburse' },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          <Typography variant="brand">money date</Typography>
          <ThemeToggle />
        </div>
        <nav className="max-w-5xl mx-auto px-6 overflow-x-auto">
          <div className="flex gap-1 pb-0">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                    isActive
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  )
                }
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
