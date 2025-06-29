import { Button } from "@/components/ui/button"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Logo } from '@/components/logo'
import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router'
import { cn } from '@/lib/utils'

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
    { href: "/person", label: "Persons" },
    { href: "/contact", label: "Contacts" }
]

export function Header() {
    return (
        <header className="border-b px-4">
            <div className="flex h-16 justify-between gap-4 container">
                {/* Left side */}
                <Logo />

                {/* Right side */}
                <div className="flex gap-3 items-center">
                    <div className="flex items-center md:hidden">
                        {/* Mobile menu trigger */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="group size-8" variant="ghost" size="icon">
                                    <svg
                                        className="pointer-events-none"
                                        width={16}
                                        height={16}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M4 12L20 12"
                                            className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                                        />
                                        <path
                                            d="M4 12H20"
                                            className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                                        />
                                        <path
                                            d="M4 12H20"
                                            className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                                        />
                                    </svg>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="w-36 p-1 md:hidden">
                                <NavigationMenu className="max-w-none *:w-full">
                                    <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                                        {navigationLinks.map((link, index) => (
                                            <NavigationMenuItem key={index} className="w-full">
                                                <NavigationMenuLink href={link.href} className="py-1.5">
                                                    {link.label}
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        ))}
                                    </NavigationMenuList>
                                </NavigationMenu>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Main nav */}
                    <div className="flex items-center gap-6">
                        {/* Navigation menu */}
                        <NavigationMenu className="h-full *:h-full max-md:hidden">
                            <NavigationMenuList className="h-full gap-2">
                                {navigationLinks.map((link) => (
                                    <NavigationMenuItem key={link.href} className="h-full">
                                        <NavLink
                                            to={link.href}
                                            className={({ isActive }) => cn(
                                                'text-muted-foreground hover:text-primary hover:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent ',
                                                {
                                                    'bg-transparent! border-b-primary': isActive
                                                }
                                            )}
                                        >
                                            {link.label}
                                        </NavLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <Button>
                        <LogOut />
                        <span className='max-md:hidden'>Sair</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
