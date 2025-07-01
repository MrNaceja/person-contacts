import type { User } from '@/models/user';
import type { AuthCredentials } from '@/services/person-contacts/auth';
import { createContext } from 'react';

export type AuthContextValues = {
    user: User | null,
    signIn: (credentials: AuthCredentials) => Promise<void>,
    signUp: (credentials: AuthCredentials) => Promise<void>,
    signOut: () => void,
    goToHome: () => void,
    goToAuth: () => void,

    isSignInPending: boolean,
    isSignUpPending: boolean
}

export const AuthContext = createContext<AuthContextValues>({} as AuthContextValues)