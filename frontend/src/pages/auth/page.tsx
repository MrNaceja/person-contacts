import { Logo } from '@/components/logo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignInForm } from '@/pages/auth/components/sign-in-form'
import { SignUpForm } from '@/pages/auth/components/sign-up-form'

export function AuthPage() {
    return (
        <section className="min-h-screen grid grid-cols-1 grid-rows-2 lg:grid-cols-[1fr_minmax(600px,auto)] lg:grid-rows-1">
            {/* Banner */}
            <div
                className={`
                    lg:bg-gradient-to-br from-brand-primary to-brand-secondary
                    flex items-center justify-center flex-col
                `}
            >
                <Logo dir="vertical"/>
            </div>
            
            {/* Auth Forms */}
            <main
                className='h-full flex flex-col justify-end lg:justify-stretch'
            >
                <Card
                    className={`
                        p-10 flex flex-col max-sm:rounded-br-none max-sm:rounded-bl-none lg:h-full lg:rounded-none    
                    `}
                >
                    <Tabs defaultValue='sign-in' className='flex flex-col gap-24 h-full justify-center lg:items-center *:w-full'>
                        <CardHeader className='gap-3'>
                            <CardTitle className='text-2xl'>Entre ou Registre-se para continuar</CardTitle>
                            <TabsList>
                                <TabsTrigger value="sign-in">
                                    Entrar
                                </TabsTrigger>
                                <TabsTrigger value="sign-up">
                                    Registrar
                                </TabsTrigger>
                            </TabsList>
                        </CardHeader>
                        <CardContent className='max-md:flex-1 flex'>
                            <TabsContent value="sign-in" className='flex-1 flex flex-col'>
                                <SignInForm />
                            </TabsContent>
                            <TabsContent value="sign-up" className='flex-1 flex flex-col'>
                                <SignUpForm />
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>
            </main>
        </section>
    )
}