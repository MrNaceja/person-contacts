import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Edit, Mail, Phone, Plus, Trash } from 'lucide-react';
import { PersonModal } from './components/person-modal';

export function PersonPage() {
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

            <ul className='grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'>
                {
                    Array.from({ length: 5 }).map((_, idx) => (
                        <li key={idx}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className='line-clamp-2'>Nome Pessoa Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo qui molestias non, rerum, ducimus vel dolore incidunt similique unde eaque nam veniam tempora cum reiciendis debitis! Magni repellat quidem accusamus!</CardTitle>
                                    <CardDescription>CPF: 000.000.000-00</CardDescription>
                                    <CardAction className='gap-2 flex items-center'>
                                        <PersonModal person={{ name: 'Banana', cpf: 'jushdjs' }}>
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
                                        <span className='text-base font-semibold'>Contatos (2)</span>
                                        <Button size="sm">
                                            <Plus />
                                            Adicionar
                                        </Button>
                                    </header>
                                    <ul className='flex flex-col gap-2'>
                                        <li>
                                            <Card className='py-3'>
                                                <CardHeader className='px-3'>
                                                    <span className='flex items-center gap-2'>
                                                        <Phone size={16} className='text-muted-foreground' />
                                                        <Badge variant="secondary">
                                                            Telefone
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
                                                    <CardDescription>(11) 99999-9999</CardDescription>
                                                </CardHeader>
                                            </Card>
                                        </li>
                                        <li>
                                            <Card className='py-3'>
                                                <CardHeader className='px-3'>
                                                    <span className='flex items-center gap-2'>
                                                        <Mail size={16} className='text-muted-foreground' />
                                                        <Badge variant="secondary">
                                                            Email
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
                                                    <CardDescription>email@email.com</CardDescription>
                                                </CardHeader>
                                            </Card>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}