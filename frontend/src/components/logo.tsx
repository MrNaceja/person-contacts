import logo from '@/assets/logo.png'
import { cx } from 'class-variance-authority'

interface LogoProps {
    dir?: 'horizontal' | 'vertical'
}
export function Logo({ dir = 'horizontal' }: LogoProps) {
    return (
        <figure className={cx('flex items-center gap-1', {
            horizontal: 'flex-row',
            vertical: 'flex-col'
        }[dir])}>
            <img
                src={logo}
                className='size-12 lg:size-16'
                alt="Pessoas e Contatos"
            />
            <figcaption className='font-semibold'>Persons • Contacts</figcaption>
        </figure>
    )
}