'use client'
import React from 'react'
import { signOut } from 'next-auth/react'
import { User } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { Button } from '../../../components/ui/button'
import { useSession } from 'next-auth/react'


export default function Navbar() {
    const {data : session , status} = useSession()


    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <Link href="/" className='text-xl font-bold mb-4 md:mb-0'>AnonSND</Link>

                {session ? (
                    <div className="flex items-center gap-4">
                        <Button className='w-full md:w-auto' onClick={() => signOut()}>LogOut</Button>
                    </div>
                ) : (
                    <Link href='/sign-in'>
                        <Button className='w-full md:w-auto'>LogIn</Button>
                    </Link>
                )}
            </div>
        </nav>
    )
}
