import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { Button } from '../../../components/ui/button'
import { getServerSession } from 'next-auth'

const session = await getServerSession(authOptions);

export default function Navbar() {

    const user : User = session?.user as User

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col nd:flex-row justify-between items-center' >
                <a className='text-xl font-bold mb-4 md:mb-0' href="#">AnonSND</a>
                {session? <>
                    <span className='mr-4'>Welcome {user.username || user.email}</span>
                    <Button className='w-full md:w-auto' onClick={()=>{ signOut() }}>LogOut</Button>
                </> 
                    : 
                <>
                   <Link href='/sign-in'>
                    <Button className='w-full md:w-auto'>LogIn.</Button>
                    </Link>
                </>}
            </div>
        </nav>
  )
}
