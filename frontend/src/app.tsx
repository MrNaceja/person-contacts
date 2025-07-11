import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@/pages/layout/layout'
import { ContactPage } from '@/pages/contact/page'
import { PersonPage } from '@/pages/person/page'
import { AuthPage } from '@/pages/auth/page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/sonner"
import type { PropsWithChildren } from 'react';
import { AuthProvider } from '@/providers/auth/provider';
import { RoutesWithAuth } from './providers/auth/routes';

const queryClient = new QueryClient()

export function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<RoutesWithAuth />}>
          <Route index element />
          <Route element={<Layout />}>
            <Route path="/person" element={<PersonPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
        </Route>
      </Routes>
    </Providers >
  )
}

function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
      <Toaster richColors />
    </QueryClientProvider>
  )
}