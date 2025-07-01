import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/auth/hook';
import { authCredentialsSchema, type AuthCredentials } from '@/services/person-contacts/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

export function SignUpForm() {
    const { signUp, isSignUpPending } = useAuth()
    const signUpForm = useForm<AuthCredentials>({
        resolver: zodResolver(authCredentialsSchema),
        disabled: isSignUpPending
    })

    const handleSignUp: SubmitHandler<AuthCredentials> = useCallback((credentials) => {
        signUp(credentials)
    }, [signUp])

    return (
        <form
            className='flex flex-col gap-8 flex-1 justify-end'
            onSubmit={signUpForm.handleSubmit(handleSignUp)}
        >
            <div className='flex flex-col gap-3'>
                <Label htmlFor="email-field" aria-required>Seu email:</Label>
                <Input
                    id="email-field"
                    placeholder='seu@email.com'
                    type="email"
                    {...signUpForm.register('email')}
                    className='peer'
                    aria-invalid={!!signUpForm.formState.errors.email}
                />
                <p
                    className="peer-aria-invalid:text-destructive mt-2 text-xs"
                    role="alert"
                    aria-live="polite"
                >
                    {signUpForm.formState.errors.email?.message}
                </p>
            </div>
            <div className='flex flex-col gap-3'>
                <Label htmlFor="email-field" aria-required>Sua senha:</Label>
                <Input
                    id="password-field"
                    placeholder='****'
                    type="password"
                    {...signUpForm.register('password')}
                    className='peer'
                    aria-invalid={!!signUpForm.formState.errors.password}
                />
                <p
                    className="peer-aria-invalid:text-destructive mt-2 text-xs"
                    role="alert"
                    aria-live="polite"
                >
                    {signUpForm.formState.errors.password?.message}
                </p>
            </div>
            <Button className="group" size="lg" type="submit" disabled={isSignUpPending}>
                Cadastrar
                <ArrowRightIcon
                    className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                    size={16}
                    aria-hidden="true"
                />
            </Button>
        </form>
    )
}