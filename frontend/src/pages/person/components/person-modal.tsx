import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, type ChangeEvent, type PropsWithChildren } from 'react';
import { z } from 'zod';
import { Formatters } from '@/utils/formatters';

const personSchema = z.object({
    name: z.string().nonempty('Nome é obrigatório.'),
    cpf: z.string().nonempty('CPF é obrigatório.')
        .refine(cpf => {
            return cpf.replace(/\D/g, '').length >= 11
        }, 'CPF deve conter 11 caracteres.')
        .refine(cpf => {
            return !!Number(cpf.replace(/\D/g, ''))
        }, 'CPF deve conter apenas números.')
})

type Person = z.infer<typeof personSchema>

interface PersonModal extends PropsWithChildren {
    person?: Person
}
export function PersonModal({ children, person }: PersonModal) {
    const isEditionMode = !!person

    const personForm = useForm<Person>({
        resolver: zodResolver(personSchema),
        defaultValues: {
            name: person?.name,
            cpf: person?.cpf
        }
    })

    const onChangeInputCpf = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.target.value = Formatters.cpf(e.target.value)
    }, [])

    const handleConfirm: SubmitHandler<Person> = useCallback((personConfirmed) => {
        if ( isEditionMode ) {
            // Handle edit
            return 
        }

        // handle creation
    }, [ isEditionMode ])

    const onCloseModal = useCallback((open: boolean) => {
        if ( open ) return
        personForm.reset()
    }, [ personForm ])

    return (
        <Dialog onOpenChange={onCloseModal}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {
                            isEditionMode
                                ? 'Editar Pessoa'
                                : 'Nova Pessoa'
                        }
                    </DialogTitle>
                    <DialogClose />
                </DialogHeader>
                <form className='flex flex-col gap-4' onSubmit={personForm.handleSubmit(handleConfirm)}>
                    <div className='flex flex-col gap-2'>
                        <Label aria-required>Nome:</Label>
                        <Input
                            placeholder='seu lindo nome...'
                            type='text'
                            {...personForm.register('name')}
                            aria-invalid={!!personForm.formState.errors.name}
                            className='peer'
                        />
                        <p
                            className="peer-aria-invalid:text-destructive mt-2 text-xs"
                            role="alert"
                            aria-live="polite"
                        >
                            {personForm.formState.errors.name?.message}
                        </p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label aria-required>CPF:</Label>
                        <Input
                            placeholder='xxx.xxx.xxx-xx'
                            type='text'
                            {...personForm.register('cpf', {
                                onChange: onChangeInputCpf,
                                maxLength: 11
                            })}
                            aria-invalid={!!personForm.formState.errors.cpf}
                            className='peer'
                        />
                        <p
                            className="peer-aria-invalid:text-destructive mt-2 text-xs"
                            role="alert"
                            aria-live="polite"
                        >
                            {personForm.formState.errors.cpf?.message}
                        </p>
                    </div>

                    <Button size='lg' type='submit'>
                        <Check />
                        Confirmar
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}