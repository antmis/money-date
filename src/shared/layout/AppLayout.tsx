import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Sun, Moon, BookOpen, BadgeDollarSign, Calendar, HandCoins, Goal, HeartHandshake, Activity, Flame, LogOut } from 'lucide-react'
import { Button, Typography, XStack } from '@/ui'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth'

const navItems = [
  { to: '/', label: 'Runway', icon: Flame },
  { to: '/quarter', label: 'Quarter', icon: Calendar },
  { to: '/allocate', label: 'Allocate', icon: HandCoins },
  { to: '/goals', label: 'Goals', icon: Goal },
  { to: '/giving', label: 'Giving', icon: HeartHandshake },
  { to: '/reimbursements', label: 'Reimburse', icon: BadgeDollarSign },
  { to: '/biz-activity', label: 'Biz Activity', icon: Activity },
  { to: '/journal', label: 'Journal', icon: BookOpen },
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

function SignOutButton() {
  const { signOut } = useAuth()
  return (
    <Button variant="ghost" size="icon" onClick={() => void signOut()} aria-label="Sign out">
      <LogOut className="h-4 w-4" />
    </Button>
  )
}

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <XStack className="max-w-5xl mx-auto px-6 items-center justify-between h-14">
          <Typography variant="brand">money date</Typography>
          <XStack gap={1} className="items-center">
            <ThemeToggle />
            <SignOutButton />
          </XStack>
        </XStack>
        <nav className="max-w-5xl mx-auto px-6 overflow-x-auto">
          <XStack gap={1}>
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
          </XStack>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
