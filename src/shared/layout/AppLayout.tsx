import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BookOpen,
  BadgeDollarSign,
  Calendar,
  HandCoins,
  Goal,
  HeartHandshake,
  Activity,
  Flame,
  PiggyBank,
  ClipboardList,
  Landmark,
  Lightbulb,
  ChevronRight,
} from 'lucide-react'
import { Typography, XStack } from '@/ui'
import { UserMenu } from '@/shared/components/UserMenu'
import { Banner } from '@/ui/banner'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu as SidebarNavMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/ui/sidebar'

function CloseMobileSidebarOnNavigate() {
  const { pathname } = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  useEffect(() => {
    if (isMobile) setOpenMobile(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return null
}

const navGroups = [
  {
    label: 'Tracking',
    icon: ClipboardList,
    items: [
      { to: '/reimbursements', label: 'Reimburse', icon: BadgeDollarSign },
      { to: '/biz-activity', label: 'Biz Activity', icon: Activity },
      { to: '/giving', label: 'Giving', icon: HeartHandshake },
    ],
  },
  {
    label: 'Financials',
    icon: Landmark,
    items: [
      { to: '/', label: 'Runway', icon: Flame },
      { to: '/quarter', label: 'Quarter', icon: Calendar },
      { to: '/allocate', label: 'Allocate', icon: HandCoins },
      { to: '/goals', label: 'Goals', icon: Goal },
    ],
  },
  {
    label: 'Reflection',
    icon: Lightbulb,
    items: [
      { to: '/journal', label: 'Journal', icon: BookOpen },
    ],
  },
]


export function AppLayout() {
  const { pathname } = useLocation()

  return (
    <SidebarProvider>
      <CloseMobileSidebarOnNavigate />
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <XStack gap={1.5} align="center" className="px-2 py-1.5">
            <PiggyBank size={18} className="shrink-0" />
            <Typography variant="brand" className="group-data-[collapsible=icon]:hidden">
              Money Date
            </Typography>
          </XStack>
        </SidebarHeader>
        <SidebarContent>
          {navGroups.map(({ label, icon: GroupIcon, items }) => (
            <SidebarGroup key={label}>
              <SidebarNavMenu>
                <Collapsible asChild defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={label}>
                        <GroupIcon />
                        <span>{label}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {items.map(({ to, label: itemLabel, icon: Icon }) => {
                          const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)
                          return (
                            <SidebarMenuSubItem key={to}>
                              <SidebarMenuSubButton asChild isActive={isActive}>
                                <NavLink to={to} end={to === '/'}>
                                  <Icon />
                                  <span>{itemLabel}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarNavMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarNavMenu>
            <SidebarMenuItem>
              <UserMenu />
            </SidebarMenuItem>
          </SidebarNavMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Banner />
        <header className="border-b bg-background sticky top-0 z-50">
          <XStack align="center" className="px-4 h-14" gap={2}>
            <SidebarTrigger />
          </XStack>
        </header>
        <div className="min-w-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
