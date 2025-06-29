import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Eye, LoaderCircle, Plus, Trash, User } from 'lucide-react';
import { ContactModal } from './components/contact-modal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import type { Contact, ContactWithPerson } from '@/models/contact';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Loading } from '@/components/loading';
import { EmptyState } from '@/components/empty-state';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { PersonModal } from '../person/components/person-modal';

export function ContactPage() {
    const queryClient = useQueryClient()
    const { data: contacts, isPending, isError, error } = useQuery({
        queryKey: ['contacts'],
        async queryFn() {
            const result = await axios.get<ContactWithPerson[]>('/contact')
            return result.data
        }
    })

    const deleteContactMutation = useMutation({
        async mutationFn(id: Contact['id']) {
            await axios.delete(`/contact/${id}`)
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['contacts'] })
        }
    })

    const withHandleDeleteContact = useCallback((id: Contact['id']) => () => {
        const deletePromise = deleteContactMutation.mutateAsync(id)
        toast.promise(deletePromise, {
            loading: 'Deletando Contato...',
            success: 'Contato deletado com sucesso.',
            error: () => ({
                message: 'Problemas ao deletar o contato.',
                description: deleteContactMutation.error?.message
            })
        })
    }, [deleteContactMutation])

    const hasContacts = contacts && contacts.length > 0

    useEffect(() => {
        if (isError) {
            toast.error('Problemas ao carregar os contatos.', {
                description: error.message
            })
        }
    }, [isError, error])
    return (
        <div className='flex flex-col container gap-6 flex-1'>
            <div className='flex flex-col gap-1'>
                <h1 className='text-2xl font-bold'>Gerenciamento de Contatos</h1>
                {
                    hasContacts && <p className='text-sm text-muted-foreground'>{contacts!.length} contato(s) encontrado(s)</p>
                }
            </div>
            <ContactModal>
                <Button size="lg" className='w-fit'>
                    <Plus />
                    <span className='max-md:hidden'>Novo Contato</span>
                </Button>
            </ContactModal>
            {
                isPending
                    ? <Loading message='Carregando contatos...' />
                    : (
                        !hasContacts
                            ? <EmptyState icon='contact' title='Ainda não há contatos cadastrados.' description='Adicione um novo contato atráves do botão "Novo Contato"' />
                            : (
                                <ul className='grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'>
                                    {
                                        contacts.map(contact => (
                                            <li key={contact.id}>
                                                <Card>
                                                    <CardHeader className='gap-4'>
                                                        <CardDescription className='flex items-center gap-2'>
                                                            <DynamicIcon
                                                                size={20}
                                                                className='text-muted-foreground'
                                                                name={{
                                                                    phone: 'phone',
                                                                    email: 'mail'
                                                                }[contact.type] as IconName}
                                                            />
                                                            <Badge variant='outline' className='px-3 py-1'>
                                                                {
                                                                    {
                                                                        phone: 'Telefone',
                                                                        email: 'Email'
                                                                    }[contact.type]
                                                                }
                                                            </Badge>
                                                        </CardDescription>
                                                        <CardTitle>{contact.description}</CardTitle>
                                                        <CardAction className='gap-2 flex items-center'>
                                                            <ContactModal contact={{ ...contact, person: contact.person.id }}>
                                                                <Button size="icon" variant="ghost">
                                                                    <Edit />
                                                                </Button>
                                                            </ContactModal>
                                                            <Button size="icon" variant="destructive" onClick={withHandleDeleteContact(contact.id)}>
                                                                {
                                                                    deleteContactMutation.isPending
                                                                        ? <LoaderCircle className='animate-spin' />
                                                                        : <Trash />
                                                                }
                                                            </Button>
                                                        </CardAction>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <Card className='p-3 flex items-center flex-row'>
                                                            <User size={24} className='text-muted-foreground' />
                                                            <div className='flex-1 flex flex-col gap-1'>
                                                                <CardTitle className='flex items-center'>
                                                                    {contact.person.name}
                                                                </CardTitle>
                                                                <CardDescription>
                                                                    {contact.person.cpf}
                                                                </CardDescription>
                                                            </div>
                                                            <PersonModal person={contact.person} readOnlyMode>
                                                                <Button size='icon' variant='ghost'>
                                                                    <Eye />
                                                                </Button>
                                                            </PersonModal>
                                                        </Card>
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