import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRightIcon } from 'lucide-react';

export function SignUpForm() {
    return (
        <form
            className='flex flex-col gap-8 flex-1 justify-end'
        >
            <div className='flex flex-col gap-3'>
                <Label htmlFor="email-field" aria-required>Seu email:</Label>
                <Input id="email-field" name="email" placeholder='seu@email.com' type="email" />
            </div>
            <div className='flex flex-col gap-3'>
                <Label htmlFor="email-field" aria-required>Sua senha:</Label>
                <Input id="password-field" name="password" placeholder='****' type="password" />
            </div>
            <Button className="group" size="lg" disabled>
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