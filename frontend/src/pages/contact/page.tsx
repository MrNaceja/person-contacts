import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Edit, Phone, Plus, Trash, User } from 'lucide-react';

export function ContactPage() {
    return (
        <div className='flex flex-col container gap-6'>
            <div className='flex flex-col gap-1'>
                <h1 className='text-2xl font-bold'>Gerenciamento de Contatos</h1>
                <p className='text-sm text-muted-foreground'>9 contatos encontrados</p>
            </div>
            <Button size="lg" className='w-fit'>
                <Plus />
                <span className='max-md:hidden'>Novo Contato</span>
            </Button>

            <ul className='grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'>
                {
                    Array.from({ length: 5 }).map((_, idx) => (
                        <li key={idx}>
                            <Card>
                                <CardHeader className='gap-4'>
                                    <CardDescription className='flex items-center gap-2'>
                                        <Phone size={20} />
                                        <Badge variant='outline' className='px-3 py-1'>Telefone</Badge>
                                    </CardDescription>
                                    <CardTitle>(47) 99999-8888</CardTitle>
                                    <CardAction className='gap-2 flex items-center'>
                                        <Button size="icon" variant="ghost">
                                            <Edit />
                                        </Button>
                                        <Button size="icon" variant="destructive">
                                            <Trash />
                                        </Button>
                                    </CardAction>
                                </CardHeader>
                                <CardContent>
                                    <Card className='p-3 flex items-center flex-row'>
                                        <User size={24} className='text-muted-foreground' />
                                        <div className='flex-1 flex flex-col gap-1'>
                                            <CardTitle className='flex items-center'>
                                                Nome da Pessoa
                                            </CardTitle>
                                            <CardDescription>
                                                000.000.000-00
                                            </CardDescription>
                                        </div>
                                        <Button size='icon' variant='ghost'>
                                            <ChevronRight />
                                        </Button>
                                    </Card>
                                </CardContent>
                            </Card>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}