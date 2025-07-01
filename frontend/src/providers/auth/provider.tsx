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
            error: () => ({
                message: 'Problemas ao autenticar',
                description: signInMutation.error?.message
            })
        })
    }, [signInMutation])

    const signUp: AuthContextValues['signUp'] = useCallback(async ({ email, password }) => {
        const signUpPromise = signUpMutation.mutateAsync({ email, password })
        toast.promise(signUpPromise, {
            loading: 'Registrando...',
            success: 'Registrado com sucesso!',
            error: () => ({
                message: 'Problemas ao registrar',
                description: signUpMutation.error?.message
            })
        })
    }, [signUpMutation])

    const signOut = useCallback(() => {
        AuthService.signOut()
        setUser(null)
        goToAuth()
    }, [goToAuth])

    useEffect(() => {
        const interceptorId = api.interceptors.response.use(
            (res) => res,
            (error: ApiPersonContactsError) => {
                if (error.status == 401) {
                    signOut()
                }
                return error
            }
        )
        return () => api.interceptors.response.eject(interceptorId)
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