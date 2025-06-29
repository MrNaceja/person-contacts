import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { contactSchema, type Contact, type ContactFormSchema } from '@/models/contact';
import { useCallback, useState, type ChangeEvent, type PropsWithChildren } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Formatters } from '@/utils/formatters';
import type { Person } from '@/models/person';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { toast } from 'sonner';
import { Loading } from '@/components/loading';
import { personsQuery } from '@/utils/query';
import { Badge } from '@/components/ui/badge';

interface ContactModalProps extends PropsWithChildren {
    person?: Person['id'],
    contact?: Contact
}
export function ContactModal({ children, contact, person }: ContactModalProps) {
    const isEditionMode = !!contact
    const shouldSelectPerson = !isEditionMode && !person
    const [isModalOpened, setIsModalOpened] = useState(false)
    const queryClient = useQueryClient()
    const contactForm = useForm<ContactFormSchema>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            personId: isEditionMode ? contact.person : person,
            type: contact?.type || 'phone',
            description: contact?.description || ''
        },
    })

    const { data: personsToSelect, isPending: isPendingPersonsToSelect } = useQuery({
        ...personsQuery(),
        enabled: shouldSelectPerson
    })

    const createContactMutation = useMutation({
        async mutationFn(newContact: ContactFormSchema) {
            await axios.post('/contact', newContact)
        },
        onSuccess() {
            queryClient.invalidateQueries()
            contactForm.reset()
        }
    })

    const editContactMutation = useMutation({
        async mutationFn(editedContact: ContactFormSchema) {
            await axios.put(`/contact/${contact!.id}`, editedContact)
        },
        onSuccess() {
            queryClient.invalidateQueries()
            setIsModalOpened(false)
        }
    })

    const handleConfirm: SubmitHandler<ContactFormSchema> = useCallback((contactConfirmed) => {
        if (isEditionMode) {
            const editPromise = editContactMutation.mutateAsync(contactConfirmed)
            toast.promise(editPromise, {
                loading: 'Atualizando contato...',
                success: 'Contato atualizado com sucesso!',
                error: () => ({
                    message: 'Problemas ao editar o contato.',
                    description: editContactMutation.error?.message
                })
            })
            return
        }

        const createPromise = createContactMutation.mutateAsync(contactConfirmed)
        toast.promise(createPromise, {
            loading: 'Criando contato...',
            success: 'Contato criado com sucesso!',
            error: () => ({
                message: 'Problemas ao criar o contato.',
                description: createContactMutation.error?.message
            })
        })
    }, [isEditionMode, createContactMutation, editContactMutation])

    const onChangeInputPhone = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        e.target.value = Formatters.phone(e.target.value)
    }, [])

    const onModalStateChange = useCallback((open: boolean) => {
        if (createContactMutation.isPending || editContactMutation.isPending) {
            toast.warning('Aguarde a confirmação dos dados...')
            return
        }
        setIsModalOpened(open)
        if (open) return
        contactForm.reset()
    }, [contactForm, createContactMutation, editContactMutation])

    const typeSelected = contactForm.watch('type')

    return (
        <Dialog onOpenChange={onModalStateChange} open={isModalOpened}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {
                            isEditionMode
                                ? 'Editar Contato'
                                : 'Novo Contato'
                        }
                    </DialogTitle>
                    <DialogClose />
                </DialogHeader>
                <form
                    className='flex flex-col gap-4'
                    onSubmit={contactForm.handleSubmit(handleConfirm)}
                >
                    <div className='flex flex-col gap-2'>
                        <Label aria-required htmlFor='type-field'>Tipo:</Label>
                        <Controller
                            control={contactForm.control}
                            name="type"
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    defaultValue={field.value}
                                    onValueChange={(value) => {
                                        if (isEditionMode) {
                                            contactForm.setValue('description', '')
                                        }
                                        else {
                                            contactForm.resetField('description')
                                        }
                                        field.onChange(value)
                                    }}
                                    >
                                    <SelectTrigger
                                        id="type-field"
                                        className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 peer"
                                        aria-invalid={!!contactForm.formState.errors.type}
                                    >
                                        <SelectValue placeholder="Selecione um tipo..." />
                                    </SelectTrigger>
                                    <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
                                        <SelectItem value="phone">
                                            <Phone size={16} aria-hidden="true" />
                                            <span className="truncate">Telefone</span>
                                        </SelectItem>
                                        <SelectItem value="email">
                                            <Mail size={16} aria-hidden="true" />
                                            <span className="truncate">Email</span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <p
                            className="peer-aria-invalid:text-destructive mt-2 text-xs"
                            role="alert"
                            aria-live="polite"
                        >
                            {contactForm.formState.errors.type?.message}
                        </p>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label aria-required htmlFor='description-field'>Descrição:</Label>
                        <Input
                            id='description-field'
                            placeholder={{
                                phone: '(99) 9999-9999',
                                email: 'exemplo@email.com'
                            }[typeSelected]}
                            type='text'
                            {...contactForm.register('description', {
                                onChange: typeSelected == 'phone' ? onChangeInputPhone : undefined,
                                maxLength: typeSelected == 'phone' ? 14 : undefined
                            })}
                            aria-invalid={!!contactForm.formState.errors.description}
                            className='peer'
                        />
                        <p
                            className="peer-aria-invalid:text-destructive mt-2 text-xs"
                            role="alert"
                            aria-live="polite"
                        >
                            {contactForm.formState.errors.description?.message}
                        </p>
                    </div>
                    {
                        shouldSelectPerson && (
                            <div className='flex flex-col gap-2'>
                                <Label aria-required htmlFor='person-field'>Pessoa:</Label>
                                <Controller
                                    control={contactForm.control}
                                    name="personId"
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                            }}
                                        >
                                            <SelectTrigger
                                                id="person-field"
                                                className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 peer"
                                                aria-invalid={!!contactForm.formState.errors.personId}
                                            >
                                                <SelectValue placeholder="Selecione uma pessoa..." />
                                            </SelectTrigger>
                                            <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
                                                {
                                                    isPendingPersonsToSelect
                                                        ? <Loading message='Buscando pessoas para seleção...' />
                                                        : (
                                                            personsToSelect!.map(person => (
                                                                <SelectItem value={person.id.toString()} key={person.id}>
                                                                    <div className='flex items-center gap-1'>
                                                                        <h5 className='flex-1 truncate'>{person.name}</h5>
                                                                        <Badge variant='outline'>{person.cpf}</Badge>
                                                                    </div>
                                                                </SelectItem>
                                                            ))
                                                        )
                                                }
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <p
                                    className="peer-aria-invalid:text-destructive mt-2 text-xs"
                                    role="alert"
                                    aria-live="polite"
                                >
                                    {contactForm.formState.errors.personId?.message}
                                </p>
                            </div>
                        )
                    }

                    <Button
                        size='lg'
                        type='submit'
                        disabled={createContactMutation.isPending || editContactMutation.isPending}
                    >
                        <Check />
                        Confirmar
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}