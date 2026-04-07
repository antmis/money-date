import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/ui'
import { AppLayout } from '@/shared/layout'
import { Runway } from '@/pages/Runway'
import { Quarter } from '@/pages/Quarter'
import { Allocate } from '@/pages/Allocate'
import { Goals } from '@/pages/Goals'
import { Giving } from '@/pages/Giving'
import { Journal } from '@/pages/Journal'
import { Reimbursements } from '@/pages/Reimbursements'

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/journal" element={<Journal />} />
            <Route path="/" element={<Runway />} />
            <Route path="/quarter" element={<Quarter />} />
            <Route path="/allocate" element={<Allocate />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/giving" element={<Giving />} />
            <Route path="/reimbursements" element={<Reimbursements />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  )
}
