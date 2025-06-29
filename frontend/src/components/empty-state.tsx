import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

interface EmptyStateProps {
    icon?: IconName,
    title?: string,
    description?: string
}
export function EmptyState({ icon = 'circle-x', title = 'Não há dados!', description = 'Tente buscar novamente...' }: EmptyStateProps) {
    return (
        <div className='flex items-center justify-center gap-2 flex-col min-h-96 flex-1'>
            <DynamicIcon name={icon} size={72} className='text-muted-foreground' />
            <h3 className='text-2xl font-semibold'>{title}</h3>
            <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
    )
}