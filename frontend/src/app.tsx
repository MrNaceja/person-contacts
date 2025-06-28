import { BrowserRouter, Route, Routes } from 'react-router';
import { Layout } from '@/pages/layout/layout' 
import { ContactPage } from '@/pages/contact/page'
import { PersonPage } from '@/pages/person/page'
import { AuthPage } from '@/pages/auth/page'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<AuthPage />} />
        <Route element={<Layout />}>
          <Route path="/person" element={<PersonPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}