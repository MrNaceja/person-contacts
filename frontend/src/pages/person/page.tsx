import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit, LoaderCircle, Plus, Trash } from 'lucide-react';
import { PersonModal } from '@/pages/person/components/person-modal';
import type { Person } from '@/models/person';
import type { Contact } from '@/models/contact';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner"
import { useCallback, useEffect } from 'react';
import { ContactModal } from '@/pages/contact/components/contact-modal'
import { Loading } from '@/components/loading';
import { EmptyState } from '@/components/empty-state';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ContactService } from '@/services/person-contacts/contact';
import { PersonService, personsQuery } from '@/services/person-contacts/person';

const filterSchema = z.object({
    personName: z.string().optional()
})

type FilterSchema = z.infer<typeof filterSchema>

export function PersonPage() {
    const queryClient = useQueryClient()
    const filterForm = useForm<FilterSchema>({
        resolver: zodResolver(filterSchema)
    })
    const personNameFilter = filterForm.watch('personName')
    const { data: persons, isPending, isError, error } = useQuery(personsQuery(personNameFilter))

    const deletePersonMutation = useMutation({
        async mutationFn(id: Person['id']) {
            await PersonService.delete(id)
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['persons'] })
        }
    })

    const deleteContactMutation = useMutation({
        async mutationFn(id: Contact['id']) {
            await ContactService.delete(id)
        },
        onSuccess() {
            queryClient.invalidateQueries()
        }
    })

    const withHandleDeletePerson = (id: Person['id']) => () => {
        const deletePromise = deletePersonMutation.mutateAsync(id)
        toast.promise(deletePromise, {
            loading: 'Deletando Pessoa...',
            success: 'Pessoa deletada com sucesso.',
            error: () => ({
                message: 'Problemas ao deletar a pessoa.',
                description: deletePersonMutation.error?.message
            })
        })
    }
    const withHandleDeleteContact = (id: Person['id']) => () => {
        const deletePromise = deleteContactMutation.mutateAsync(id)
        toast.promise(deletePromise, {
            loading: 'Deletando Contato...',
            success: 'Contato deletado com sucesso.',
            error: () => ({
                message: 'Problemas ao deletar o contato.',
                description: deleteContactMutation.error?.message
            })
        })
    }

    const handleSearchFilter: SubmitHandler<FilterSchema> = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['persons'] })
    }, [queryClient])

    const hasPersons = persons && persons.length > 0

    useEffect(() => {
        if (!personNameFilter) {
            queryClient.invalidateQueries({ queryKey: ['persons'] })
        }
    }, [personNameFilter, queryClient])
    useEffect(() => {
        if (isError) {
            toast.error('Problemas ao carregar as pessoas.', {
                description: error.message
            })
        }
    }, [isError, error])
    return (
        <div className='flex flex-col container gap-6 flex-1'>
            <div className='flex flex-col gap-1'>
                <h1 className='text-2xl font-bold'>Gerenciamento de Pessoas</h1>
                <p className='text-sm text-muted-foreground'>
                    {persons?.length || 0} pessoa(s) encontrada(s)
                </p>
            </div>
            <div className='flex items-center gap-2 justify-between'>
                <PersonModal>
                    <Button size="lg">
                        <Plus />
                        <span className='max-md:hidden'>Nova Pessoa</span>
                    </Button>
                </PersonModal>
                <search className='flex-1 md:max-w-96'>
                    <form className='flex items-center gap-2' onSubmit={filterForm.handleSubmit(handleSearchFilter)}>
                        <Input placeholder='Filtrar por nome... (Enter para confirmar)' type='search' {...filterForm.register('personName')} />
                    </form>
                </search>
            </div>
            {
                isPending
                    ? <Loading message='Carregando pessoas...' />
                    : (
                        !hasPersons
                            ? <EmptyState icon='users' title='Ainda não há pessoas cadastradas' description='Adicione uma nova pessoa atráves do botão "Nova Pessoa"' />
                            : (
                                <ul className='grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 flex-1'>
                                    {
                                        persons.map(person => (
                                            <li key={person.id}>
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className='line-clamp-2'>{person.name}</CardTitle>
                                                        <CardDescription>CPF: {person.cpf}</CardDescription>
                                                        <CardAction className='gap-2 flex items-center'>
                                                            <PersonModal person={person}>
                                                                <Button size="icon" variant="ghost">
                                                                    <Edit />
                                                                </Button>
                                                            </PersonModal>
                                                            <Button size="icon" variant="destructive" onClick={withHandleDeletePerson(person.id)} disabled={deletePersonMutation.isPending}>
                                                                {
                                                                    deletePersonMutation.isPending
                                                                        ? <LoaderCircle className='animate-spin' />
                                                                        : <Trash />
                                                                }
                                                            </Button>
                                                        </CardAction>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <header className='flex justify-between items-center py-3'>
                                                            <span className='text-base font-semibold'>Contatos ({person.contacts.length})</span>
                                                            <ContactModal person={person.id}>
                                                                <Button size="sm">
                                                                    <Plus />
                                                                    Adicionar
                                                                </Button>
                                                            </ContactModal>
                                                        </header>
                                                        <ul className='flex flex-col gap-2'>
                                                            {
                                                                person.contacts.map(contact => (
                                                                    <li key={contact.id}>
                                                                        <Card className='py-3'>
                                                                            <CardHeader className='px-3'>
                                                                                <span className='flex items-center gap-2'>
                                                                                    <DynamicIcon
                                                                                        size={16}
                                                                                        className='text-muted-foreground'
                                                                                        name={{
                                                                                            phone: 'phone',
                                                                                            email: 'mail'
                                                                                        }[contact.type] as IconName}
                                                                                    />
                                                                                    <Badge variant="secondary">
                                                                                        {
                                                                                            {
                                                                                                phone: 'Telefone',
                                                                                                email: 'Email'
                                                                                            }[contact.type]
                                                                                        }
                                                                                    </Badge>
                                                                                </span>
                                                                                <CardAction className='flex items-center gap-2'>
                                                                                    <ContactModal contact={contact}>
                                                                                        <Button size="icon" variant="outline">
                                                                                            <Edit />
                                                                                        </Button>
                                                                                    </ContactModal>
                                                                                    <Button size="icon" variant="outline" onClick={withHandleDeleteContact(contact.id)}>
                                                                                        <Trash />
                                                                                    </Button>
                                                                                </CardAction>
                                                                                <CardDescription>{contact.description}</CardDescription>
                                                                            </CardHeader>
                                                                        </Card>
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </CardContent>
                                                </Card>
                                            </li>
                                        ))
                                    }
                                </ul>
                            )
                    )
            }
        </div>
    )
}