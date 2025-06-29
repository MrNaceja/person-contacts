import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@/pages/layout/layout'
import { ContactPage } from '@/pages/contact/page'
import { PersonPage } from '@/pages/person/page'
import { AuthPage } from '@/pages/auth/page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "@/components/ui/sonner"
import { NuqsAdapter } from 'nuqs/adapters/react'
import type { PropsWithChildren } from 'react';

const queryClient = new QueryClient()

export function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<AuthPage />} />
          <Route element={<Layout />}>
            <Route path="/person" element={<PersonPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  )
}

function Providers({ children }: PropsWithChildren) {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors />
      </QueryClientProvider>
    </NuqsAdapter>
  )
}