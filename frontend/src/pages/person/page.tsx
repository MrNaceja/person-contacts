import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit, Plus, Trash, UserX } from 'lucide-react';
import { PersonModal } from './components/person-modal';
import { useCallback, useEffect, useState } from 'react';
import { fetcher } from '@/utils/fetcher';
import type { Person } from '@/models/person';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

export function PersonPage() {
    const [persons, setPersons] = useState<Person[]>([])
    const isWithoutPersons = persons.length === 0

    const fetchPersons = useCallback(async () => {
        const personsFetched = await fetcher<Person[]>('/person')
        setPersons(personsFetched)
    }, [setPersons])

    useEffect(() => {
        if (persons.length == 0) {
            fetchPersons()
        }
    }, [persons, fetchPersons])
    return (
        <div className='flex flex-col container gap-6'>
            <h1 className='text-2xl font-bold'>Gerenciamento de Pessoas</h1>
            <div className='flex items-center gap-2 justify-between'>
                <PersonModal>
                    <Button size="lg">
                        <Plus />
                        <span className='max-md:hidden'>Nova Pessoa</span>
                    </Button>
                </PersonModal>
                <search className='flex-1 md:max-w-96'>
                    <form className='flex items-center gap-2'>
                        <Input placeholder='Filtrar por nome...' type='search' />
                    </form>
                </search>
            </div>
            {
                isWithoutPersons
                    ? ( // Empty State
                        <div className='flex items-center justify-center gap-2 flex-col min-h-96 flex-1'>
                            <UserX size={72} className='text-muted-foreground'/>
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
                                                    <Button size="icon" variant="destructive">
                                                        <Trash />
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
            }
        </div>
    )
}