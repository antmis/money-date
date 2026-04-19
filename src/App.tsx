import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster, TooltipProvider } from '@/ui'
import { AppLayout } from '@/shared/layout'
import { AuthProvider, LoginPage, RequireAuth } from '@/features/auth'
import { WorkspaceProvider, RequireWorkspace } from '@/features/workspace'
import { Runway } from '@/pages/Runway'
import { Quarter } from '@/pages/Quarter'
import { Allocate } from '@/pages/Allocate'
import { Goals } from '@/pages/Goals'
import { Giving } from '@/pages/Giving'
import { Journal } from '@/pages/Journal'
import { Reimbursements } from '@/pages/Reimbursements'
import { BusinessActivity } from '@/pages/BusinessActivity'
import { Profile } from '@/pages/Profile'

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <WorkspaceProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={
                  <RequireAuth>
                    <RequireWorkspace>
                      <AppLayout />
                    </RequireWorkspace>
                  </RequireAuth>
                }>
                  <Route path="/" element={<Runway />} />
                  <Route path="/quarter" element={<Quarter />} />
                  <Route path="/allocate" element={<Allocate />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/giving" element={<Giving />} />
                  <Route path="/reimbursements" element={<Reimbursements />} />
                  <Route path="/biz-activity" element={<BusinessActivity />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Routes>
            </WorkspaceProvider>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  )
}
