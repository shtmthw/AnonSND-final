"use client"

import React , {useState } from 'react'
import * as z from 'zod'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { Apiresp } from '@/types/ApiResp'
import { FormItem } from '@/components/ui/form'
import { FormLabel } from '@/components/ui/form'
import { Form } from '@/components/ui/form'
import { FormControl } from '@/components/ui/form'
import axios, { AxiosError } from 'axios'
import { FormMessage } from '@/components/ui/form'
import * as LR from 'lucide-react'
import { singInSchema } from '@/schemas/singIn'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { error } from 'console'



function Singin(){

    // Use only if the user is manually logging in.
    const form = useForm<z.infer<typeof singInSchema>>({
        resolver  : zodResolver(singInSchema),
        defaultValues : {
            identifier : "",
            password : ""
        }
    })

    const router = useRouter()

    const onClick_Oauth_ver = async() => {
        
        try {
            const result = await signIn('google' , { redirect : false })
    
            if(result?.url){
                router.replace('/dashboard')
            }
            if(result?.error){
                toast(`${result.error}`)
            }else{
                toast('Logged in!')
            }


        } catch (error) {
            toast(`Failed Logging in, err : ${error}`)
            console.log(error)
            
        }

    }

    const onSubmit_CredProvider_ver = async(data : z.infer<typeof singInSchema>) => {
        try {
            
            const result = await signIn('credentials' , {
                redirect : false,
                identifier : data.identifier ,
                password : data.password
            })

            if(result?.url){
                router.replace('/dashboard')
            }
            if(result?.error){
                toast(`${result.error}`)
            }else{
                toast('Logged in!')
            }

        } catch (error) {
            toast(`Failed Logging in, err : ${error}`)
        }
    }

    return(
        <>
        
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

                {/* Credentials Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit_CredProvider_ver)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email or Username</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter your email or username" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" placeholder="Enter your password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </form>
                </Form>

                {/* OAuth Sign-In */}
                <div className="mt-6">
                    <Button onClick={onClick_Oauth_ver} variant="outline" className="w-full">
                        Sign In with Google
                    </Button>
                </div>

                {/* Sign Up Link */}
                <div className="mt-4 text-center">
                    <Link href="/sign-up" className="text-sm text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
        </>
    )
}

export default Singin