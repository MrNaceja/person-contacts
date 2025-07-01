import { useAuth } from '@/providers/auth/hook';
import { Navigate, Outlet, useLocation } from 'react-router';

export function RoutesWithAuth() {
    const { user } = useAuth()
    const { pathname } = useLocation()
    return (
        user 
        ? (pathname === '/') ? <Navigate to='/person'/> : <Outlet /> 
        : <Navigate to='/auth' />
    )
}