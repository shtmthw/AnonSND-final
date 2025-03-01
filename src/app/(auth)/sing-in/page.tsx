'use client'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, useForm } from 'react-hook-form'
import { FormDescription } from '@/components/ui/form'
import * as z from 'zod'
import Link from 'next/link'
import { useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/router'
import { singupSchema } from '@/schemas/userSingUp'
import { Apiresp } from '@/types/ApiResp'
import { FormItem } from '@/components/ui/form'
import { FormLabel } from '@/components/ui/form'
import { FormControl } from '@/components/ui/form'
import axios, { AxiosError } from 'axios'
import { FormMessage } from '@/components/ui/form'
import { Loader } from 'next/dynamic'
import * as LR from 'lucide-react'
function page() {
  const [usernameMsg, setUsernameMsg] = useState('')
  const [username, setUsername] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)


  const router = useRouter()
  const debouncedUsername = useDebounceValue(username, 500)

  //zod usage
  const form = useForm<z.infer<typeof singupSchema>>({
    resolver: zodResolver(singupSchema),
    defaultValues: {
      username: '',
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true)
        setUsernameMsg('')

        try {
          const resp = await axios.get(`/api/check-unique-username?username=${debouncedUsername}`)
          setUsernameMsg(resp.data.msg)
        } catch (error) {
          const axiosErr = error as AxiosError<Apiresp>
          setUsernameMsg(axiosErr.response?.data.msg ?? "err checking username")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsername()
  }, [debouncedUsername])

  const onSubmit = async (data: z.infer<typeof singupSchema>) => {
    setIsSubmitting(true)
    try {
      const resp = await axios.post<Apiresp>('/api/singUp', data)

      toast("Success", {
        description: resp.data.msg
      })

      router.replace(`/verification?username=${username}1`)
      setIsSubmitting(false)

    } catch (error) {
      const axiosErr = error as AxiosError<Apiresp>
      const errMsg = axiosErr.response?.data.msg

      toast("Failed signing up!", {
        description: errMsg
      })
      setIsSubmitting(false)
    }
  }
  return (
    <div className='flex justify-center items-center
    min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white-rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl front-extrabold tracking-tight lg:text-5xl mb-6'>
            Join AnonSND
          </h1>
          <p className="mb-4">Sing Up To Start The Sail Of Shores In The Darkness.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} onChange={(e) => {
                    setUsername(e.target.value)
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          <button disabled={isSubmitting} type='submit'>{
              isSubmitting? (
                <>
                  <LR.Loader2 className='mr-2 h-4 w-4 animate-spin'/>Please Wait
                </>
              ) : "SingUp"
            }</button>
        </Form>
      </div>
    </div>
  )
}

export default page