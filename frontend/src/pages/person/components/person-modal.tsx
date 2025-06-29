import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState, type ChangeEvent, type PropsWithChildren } from 'react';
import { Formatters } from '@/utils/formatters';
import { personFormSchema, type Person, type PersonFormSchema } from '@/models/person';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { axios } from '@/lib/axios';

interface PersonModal extends PropsWithChildren {
    person?: Person,
    readOnlyMode?: boolean
}
export function PersonModal({ children, person, readOnlyMode = false }: PersonModal) {
    const [isModalOpened, setIsModalOpened] = useState(false)
    const queryClient = useQueryClient()

    const createPersonMutation = useMutation({
        async mutationFn(newPerson: PersonFormSchema) {
            await axios.post('/person', newPerson)
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['persons'] })
            personForm.reset()
        }
    })

    const editPersonMutation = useMutation({
        async mutationFn(editedPerson: PersonFormSchema) {
            await axios.put(`/person/${person!.id}`, editedPerson)
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['persons'] })
            setIsModalOpened(false)
        }
    })

    const isEditionMode = !!person

    const personForm = useForm<PersonFormSchema>({
        resolver: zodResolver(personFormSchema),
        defaultValues: {
            name: person?.name,
            cpf: person?.cpf
        },
        disabled: readOnlyMode
    })

    const onChangeInputCpf = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.target.value = Formatters.cpf(e.target.value)
    }, [])

    const handleConfirm: SubmitHandler<PersonFormSchema> = useCallback((personConfirmed) => {
        if (isEditionMode) {
            const editPromise = editPersonMutation.mutateAsync(personConfirmed)
            toast.promise(editPromise, {
                loading: 'Atualiando dados da pessoa...',
                success: 'Pessoa editada com sucesso!',
                error: () => ({
                    message: 'Problemas ao editar a pessoa.',
                    description: editPersonMutation.error?.message
                })
            })
            return
        }

        const createPromise = createPersonMutation.mutateAsync(personConfirmed)
        toast.promise(createPromise, {
            loading: 'Criando pessoa...',
            success: 'Pessoa criada com sucesso!',
            error: () => ({
                message: 'Problemas ao criar a pessoa.',
                description: createPersonMutation.error?.message
            })
        })
    }, [isEditionMode, createPersonMutation, editPersonMutation])

    const onModalStateChange = useCallback((open: boolean) => {
        if (createPersonMutation.isPending || editPersonMutation.isPending) {
            toast.warning('Aguarde a confirmação dos dados...')
            return
        }
        setIsModalOpened(open)
        if (open) return
        personForm.reset()
    }, [personForm, createPersonMutation, editPersonMutation])

    return (
        <Dialog onOpenChange={onModalStateChange} open={isModalOpened}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {
                            readOnlyMode
                                ? 'Dados da Pessoa'
                                : (
                                    isEditionMode
                                        ? 'Editar Pessoa'
                                        : 'Nova Pessoa'
                                )
                        }
                    </DialogTitle>
                    <DialogClose />
                </DialogHeader>
                <form className='flex flex-col gap-4' onSubmit={personForm.handleSubmit(handleConfirm)}>
                    <div className='flex flex-col gap-2'>
                        <Label aria-required htmlFor='name-field'>Nome:</Label>
                        <Input
                            id='name-field'
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
                        <Label aria-required htmlFor='cpf-field'>CPF:</Label>
                        <Input
                            id='cpf-field'
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

                    {
                        !readOnlyMode && (
                            <Button size='lg' type='submit' disabled={createPersonMutation.isPending || editPersonMutation.isPending}>
                                <Check />
                                Confirmar
                            </Button>
                        )
                    }
                </form>
            </DialogContent>
        </Dialog>
    )
}