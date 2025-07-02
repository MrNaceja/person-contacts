import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import { AuthContext, type AuthContextValues } from './context';
import type { User } from '@/models/user';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { AuthService, type AuthCredentials } from '@/services/person-contacts/auth';
import { api, type ApiPersonContactsError } from '@/services/person-contacts/api';

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(AuthService.catchUser())
    const navigate = useNavigate()

    const signInMutation = useMutation<User, ApiPersonContactsError, AuthCredentials>({
        mutationFn: AuthService.signIn,
        onSuccess(user) {
            setUser(user)
            goToHome()
        }
    })
    const signUpMutation = useMutation<User, ApiPersonContactsError, AuthCredentials>({
        mutationFn: AuthService.signUp,
        onSuccess(user) {
            setUser(user)
            goToHome()
        }
    })

    const goToHome: AuthContextValues['goToHome'] = useCallback(() => navigate('/person'), [navigate])
    const goToAuth: AuthContextValues['goToAuth'] = useCallback(() => navigate('/auth'), [navigate])

    const signIn: AuthContextValues['signIn'] = useCallback(async ({ email, password }) => {
        const signInPromise = signInMutation.mutateAsync({ email, password })
        toast.promise(signInPromise, {
            loading: 'Autenticando...',
            success: 'Autenticado com sucesso!',
            error: (err) => ({
                message: 'Problemas ao autenticar',
                description: (err as ApiPersonContactsError).message
            })
        })
    }, [signInMutation])

    const signUp: AuthContextValues['signUp'] = useCallback(async ({ email, password }) => {
        const signUpPromise = signUpMutation.mutateAsync({ email, password })
        toast.promise(signUpPromise, {
            loading: 'Registrando...',
            success: 'Registrado com sucesso!',
            error: (err) => ({
                message: 'Problemas ao registrar',
                description: (err as ApiPersonContactsError).message
            })
        })
    }, [signUpMutation])

    const signOut = useCallback(() => {
        AuthService.signOut()
        setUser(null)
        goToAuth()
    }, [goToAuth])

    useEffect(() => {
        const authenticatedRequestsInterceptorId = api.interceptors.request.use((config) => {
            const isPublic = ['/auth/sign-in', '/auth/sign-up'].some((url) =>
                config.url?.includes(url)
            );

            if (!isPublic) {
                const authToken = AuthService.catchToken()
                if (authToken) {
                    config.headers.Authorization = `Bearer ${authToken}`
                }
            }
            return config
        })
        const unhautorizedResponseErrorInterceptorId = api.interceptors.response.use(
            (res) => res,
            (error: ApiPersonContactsError) => {
                if (error.status == 401) {
                    signOut()
                }
                return Promise.reject(error)
            }
        )
        return () => {
            api.interceptors.request.eject(authenticatedRequestsInterceptorId)
            api.interceptors.response.eject(unhautorizedResponseErrorInterceptorId)
        }
    }, [navigate, goToAuth, signOut])
    return (
        <AuthContext.Provider
            value={{
                user,
                signIn,
                signUp,
                signOut,
                goToHome,
                goToAuth,
                isSignInPending: signInMutation.isPending,
                isSignUpPending: signUpMutation.isPending
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}