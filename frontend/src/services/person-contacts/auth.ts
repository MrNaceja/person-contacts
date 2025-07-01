import type { User } from '@/models/user'
import { api } from '@/services/person-contacts/api'
import { z } from 'zod'

export const authCredentialsSchema = z.object({
    email: z.string().email('Email é obrigatório.'),
    password: z.string().min(3, 'Minímo de 3 caracteres').nonempty('Senha é obrigatória.')
})

export type AuthCredentials = z.infer<typeof authCredentialsSchema>

export type AuthResponse = {
    user: User,
    token: string
}

const AUTH_TOKEN_STORAGE_KEY = '@person-contacts::auth-token'
const AUTH_USER_STORAGE_KEY = '@person-contacts::auth-user'

function storeToken(token: string | null) {
    if (!token) {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
        return
    }
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
}

function storeUser(user: User | null) {
    if (!user) {
        localStorage.removeItem(AUTH_USER_STORAGE_KEY)
        return
    }
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
}

function catchTokenStored(): string | null {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
}

function catchUserStored(): User|null {
    const serializedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY)
    if ( !serializedUser )  {
        return null
    }

    return JSON.parse(serializedUser)
}

function clearAuthStore() {
    storeToken(null)
    storeUser(null)
}

export const AuthService = {
    async signIn({ email, password }: AuthCredentials) {
        const { token, user } = (await api.post<AuthResponse>('/auth/sign-in', { email, password })).data
        storeToken(token)
        storeUser(user)
        return user
    },
    async signUp({ email, password }: AuthCredentials) {
        const { token, user } = (await api.post<AuthResponse>('/auth/sign-up', { email, password })).data
        storeToken(token)
        storeUser(user)
        return user
    },
    signOut() {
        clearAuthStore()
    },
    catchToken() {
        return catchTokenStored()
    },
    catchUser() {
        return catchUserStored()
    }
}