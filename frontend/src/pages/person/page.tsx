import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit, LoaderCircle, Plus, Trash, UserX } from 'lucide-react';
import { PersonModal } from '@/pages/person/components/person-modal';
import type { Person } from '@/models/person';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner"
import { useCallback, useEffect, type FormEvent } from 'react';
import { axios } from '@/lib/axios';
import { useQueryState } from 'nuqs'
import { cx } from 'class-variance-authority';

export function PersonPage() {
    const queryClient = useQueryClient()
    const [searchPersonName, setSearchPersonName] = useQueryState('name')
    const { data: persons, isPending, isError, error } = useQuery({
        queryKey: ['persons'],
        queryFn: async () => {
            const result = await axios.get<Person[]>('/person', {
                params: {
                    name: searchPersonName
                }
            })
            return result.data
        }
    })

    const deletePersonMutation = useMutation({
        async mutationFn(id: Person['id']) {
            await axios.delete(`/person/${id}`)
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['persons'] })
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

    const handleSubmitSearch = useCallback((e: FormEvent) => {
        e.preventDefault()
        queryClient.invalidateQueries({ queryKey: ['persons'] })
    }, [queryClient])

    const hasPersons = persons && persons.length > 0

    useEffect(() => {
        if (!searchPersonName) {
            queryClient.invalidateQueries({ queryKey: ['persons'] })
        }
    }, [searchPersonName, queryClient])
    useEffect(() => {
        if (isError) {
            toast.error('Problemas ao carregar as pessoas.', {
                description: error.message
            })
        }
    }, [isError, error])
    return (
        <div className='flex flex-col container gap-6 flex-1'>
            <h1 className='text-2xl font-bold'>Gerenciamento de Pessoas</h1>
            <p className={cx('text-muted-foreground', { 'hidden': !searchPersonName })}>Buscando por "{searchPersonName}"</p>
            <div className='flex items-center gap-2 justify-between'>
                <PersonModal>
                    <Button size="lg">
                        <Plus />
                        <span className='max-md:hidden'>Nova Pessoa</span>
                    </Button>
                </PersonModal>
                <search className='flex-1 md:max-w-96'>
                    <form className='flex items-center gap-2' onSubmit={handleSubmitSearch}>
                        <Input placeholder='Filtrar por nome...' type='search' onChange={(e) => setSearchPersonName(e.target.value || null)} />
                    </form>
                </search>
            </div>
            {
                isPending
                    ? ( // Loading State
                        <div className='flex items-center justify-center gap-2 flex-col min-h-96 flex-1'>
                            <LoaderCircle size={72} className='text-muted-foreground animate-spin' />
                            <h3 className='text-2xl font-semibold'>Carregando pessoas...</h3>
                        </div>
                    )
                    : (
                        !hasPersons
                            ? ( // Empty State
                                <div className='flex items-center justify-center gap-2 flex-col min-h-96 flex-1'>
                                    <UserX size={72} className='text-muted-foreground' />
                                    <h3 className='text-2xl font-semibold'>Ainda não há pessoas cadastradas</h3>
                                    <p className='text-sm text-muted-foreground'>Adicione uma nova pessoa atráves do botão "Nova Pessoa"</p>
                                </div>
                            )
                            : (
                                <ul className='grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'>
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
                                                            <Button size="sm">
                                                                <Plus />
                                                                Adicionar
                                                            </Button>
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
                                                                                    <Button size="icon" variant="outline">
                                                                                        <Edit />
                                                                                    </Button>
                                                                                    <Button size="icon" variant="outline">
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