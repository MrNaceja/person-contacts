import { Header } from '@/pages/layout/header'
import { Outlet } from 'react-router';

export function Layout() {
    return (
        <section className='min-h-screen flex flex-col gap-12'>
            <Header />
            <main className='flex-1'>
                <Outlet />
            </main>
        </section>
    )
}