"use client";
import useMedia from 'use-media'
import { usePathname, useRouter } from "next/navigation";
import NavButton from "./NavButton";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const links = [
    {
        href:'/',
        label: "Overview"
    },
    {
        href:'/transitions',
        label: "Transitions"
    },
    {
        href:'/accounts',
        label: "Accounts"
    },
    {
        href:'/categories',
        label: "Categories"
    },
    {
        href:'/settings',
        label: "Settings"
    }
];


export default function Navigation() {

    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isMobile = useMedia("(max-width: 1024px)", false);

    const closeMenu = (href:string)=>{
        router.push(href);
        setIsOpen(false);
    };

    if(isMobile){
        return(
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                    variant="outline"
                    size="sm"
                    className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
                    >
                    <Menu className='size-4'/> 
                    </Button>
                </SheetTrigger>
                <SheetContent side='left' className='px-2 w-[250px]'>
                <nav className='flex flex-col gap-y-2 pt-6 '> 
                    {links.map((link)=>(
                        <Button  variant={link.href === pathname ? "secondary" : "ghost"}
                        key={link.href}
                        onClick={()=>closeMenu(link.href)}
                        className='w-full justify-start'
                        >
                        {link.label}
                        </Button>
                    ))}
                </nav>
                </SheetContent>
            </Sheet>
        )
    }

  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
        {links.map((link)=>(
            <NavButton key={link.href}
            href={link.href}
            label={link.label}
            isActive= {pathname === link.href}
            />
        ))}
    </nav>
  )
}
