import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, BadgeDollarSign, Calendar, HandCoins, Goal, HeartHandshake, Activity, Flame, UserRoundPen } from 'lucide-react'
import { Typography, XStack } from '@/ui'
import { cn } from '@/lib/utils'
import { UserMenu } from '@/shared/components/UserMenu'

const navItems = [
  { to: '/', label: 'Runway', icon: Flame },
  { to: '/quarter', label: 'Quarter', icon: Calendar },
  { to: '/allocate', label: 'Allocate', icon: HandCoins },
  { to: '/goals', label: 'Goals', icon: Goal },
  { to: '/giving', label: 'Giving', icon: HeartHandshake },
  { to: '/reimbursements', label: 'Reimburse', icon: BadgeDollarSign },
  { to: '/biz-activity', label: 'Biz Activity', icon: Activity },
  { to: '/journal', label: 'Journal', icon: BookOpen },
  { to: '/profile', label: 'Profile', icon: UserRoundPen },
]


export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background sticky top-0 z-50">
        <XStack className="max-w-5xl mx-auto px-6 items-center justify-between h-14">
          <Typography variant="brand">money date</Typography>
          <UserMenu />
        </XStack>
        <nav className="max-w-5xl mx-auto px-6 overflow-x-auto">
          <XStack gap={1} className="navbar-container">
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
                {Icon && <Icon size={14} />}
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
