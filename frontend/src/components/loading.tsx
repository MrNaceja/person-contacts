import { LoaderCircle } from 'lucide-react';

interface LoadingProps {
    message?: string
}
export function Loading({ message = 'Carregando...' }: LoadingProps) {
    return (
        <div className='flex items-center justify-center gap-2 flex-col min-h-96 flex-1'>
            <LoaderCircle size={72} className='text-muted-foreground animate-spin' />
            <h3 className='text-2xl font-semibold'>{message}</h3>
        </div>
    )
}