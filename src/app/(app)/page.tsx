'use client'
import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Apiresp } from '@/types/ApiResp'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import * as lr from 'lucide-react'

interface Messages {
  content : string,
  date : Date
}

export default function Landingpage() {

  const route = useRouter()

  interface formInter {
    userUrl: string
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<formInter>()
  const [isLoading , setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Messages[]>([])

  const onFormSub = async (e: any) => {
    // e.preventDefault()
    setIsLoading(true)
    try {
      const urlA = watch('userUrl')
      if (!urlA.includes('http://192.168.0.115:3000/send-Text?u=')) {
        toast("Not a valid url")
      }
      const url = urlA;
      const urlParams = new URLSearchParams(new URL(url).search);
      const username = urlParams.get('u')

      const resp = await axios.post('/api/check-User-Url', { username: username })

      if (!resp.data.success) {
        toast(resp.data.msg)
      }
      route.replace(`/send-Text?u=${resp.data.username}`)
    } catch (error) {
      const axiErr = error as AxiosError<Apiresp>
      const Rerror = axiErr.response?.data.msg
      toast(`Error : ${Rerror}`)
    }finally{
      setIsLoading(false)
    }
  }

  const getMessages = async () => {
    try {
      const resp = await axios.get('/api/get-messages')
      setMessages(resp.data.messages)
      console.log(resp.data.messages)

    } catch (error) {
      const axiErr = error as AxiosError<Apiresp>
      const Rerror = axiErr.response?.data.msg
      toast(`Error while fetching messages : ${Rerror}`)
    }
  }

  useEffect(() => {
    getMessages()
  }, [])

  return (
    <>
      <div className="max-w-7xl mx-auto py-10 px-5">
        <h1 className='text-3xl font-bold mb-4 text-center text-blue-600'>Welcome to ANONSND</h1>
        <span className="text-lg text-gray-600 block text-center mb-8">Enjoy Our Anonymous Texting Service!!</span>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-700">Send Messages Using a User URL</h2>
          <form onSubmit={handleSubmit(onFormSub)} className="mt-4 flex justify-center items-center space-x-2">
            <Input
              placeholder='Put the user URL..'
              className="w-full max-w-xs"
              {...register("userUrl", { required: true })}
            />
            {errors.userUrl && <span className="text-red-500 text-sm">This field is required</span>}
            {isLoading?
            <>
              {<lr.Loader2/>}
            </> : <>
              <Button type='submit' className="bg-blue-600 text-white">Search</Button>
            
            </>}
          </form>
        </div>
        <div>
            <h1 style={{marginTop : '100px'}} className='text-3xl font-semibold mb-4 text-center text-black-600'>Your Inbox Below..</h1>
        </div>
        {/* Message Carousel */}
        <div className="flex items-center justify-center h-screen bg-gray-100">
          {messages.length !== 0 ? (
            <Carousel className="w-full max-w-xs h-[400px]"> {/* Adjusted the height here */}
              <CarouselContent>
                {messages.map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="shadow-xl hover:shadow-2xl transition-all">
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => { route.replace('/dashboard') }}
                            className="text-2xl font-semibold text-black-700 hover:text-blue-900"
                          >
                            {item.content}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext />
              <CarouselPrevious />
            </Carousel>
          ) : (
            <div className="text-xl text-gray-700">No Messages To Show</div>
          )}
        </div>
      </div>
    </>
  )
}
