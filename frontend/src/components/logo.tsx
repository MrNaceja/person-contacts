import { cva, type VariantProps } from 'class-variance-authority'
import { ShieldUser } from 'lucide-react'

const logoStyles = cva('flex items-center gap-1', {
    variants: {
        dir: {
            horizontal: 'flex-row',
            vertical: 'flex-col'
        }
    },
    defaultVariants: {
        dir: 'horizontal'
    }
})

const iconStyles = cva('', {
    variants: {
        size: {
            sm: 'size-12',
            md: 'size-20',
            lg: 'size-24'
        }
    },
    defaultVariants: {
        size: 'sm'
    }
})

interface LogoProps extends VariantProps<typeof logoStyles>, VariantProps<typeof iconStyles> {}
export function Logo({ dir, size }: LogoProps) {
    return (
        <figure className={logoStyles({ dir })}>
            <ShieldUser className={iconStyles({ size })}/>
            <figcaption className='font-semibold tracking-tight'>Person Contacts</figcaption>
        </figure>
    )
}