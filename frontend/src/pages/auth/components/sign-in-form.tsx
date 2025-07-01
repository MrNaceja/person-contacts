import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/auth/hook';
import { authCredentialsSchema, type AuthCredentials } from '@/services/person-contacts/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

export function SignInForm() {
    const { signIn, isSignInPending } = useAuth()
    const signInForm = useForm<AuthCredentials>({
        resolver: zodResolver(authCredentialsSchema),
        disabled: isSignInPending
    })

    const handleSignIn: SubmitHandler<AuthCredentials> = useCallback((credentials) => {
        signIn(credentials)
    }, [ signIn ])

    return (
        <form
            className='flex flex-col gap-8 flex-1'
            onSubmit={signInForm.handleSubmit(handleSignIn)}
        >
            <div className='flex flex-col gap-3'>
                <Label htmlFor="email-field" aria-required>Seu email:</Label>
                <Input
                    id="email-field"
                    placeholder='seu@email.com'
                    type="email"
                    {...signInForm.register('email')}
                    className='peer'
                    aria-invalid={!!signInForm.formState.errors.email}
                />
                <p
                    className="peer-aria-invalid:text-destructive mt-2 text-xs"
                    role="alert"
                    aria-live="polite"
                >
                    {signInForm.formState.errors.email?.message}
                </p>
            </div>
            <div className='flex flex-col gap-3'>
                <Label htmlFor="email-field" aria-required>Sua senha:</Label>
                <Input
                    id="password-field"
                    placeholder='****'
                    type="password"
                    {...signInForm.register('password')}
                    className='peer'
                    aria-invalid={!!signInForm.formState.errors.password}
                />
                <p
                    className="peer-aria-invalid:text-destructive mt-2 text-xs"
                    role="alert"
                    aria-live="polite"
                >
                    {signInForm.formState.errors.password?.message}
                </p>
            </div>
            <Button className="group" size="lg" type="submit" disabled={isSignInPending}>
                Entrar
                <ArrowRightIcon
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                />
            </Button>
        </form>
    )
}