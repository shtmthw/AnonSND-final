import React, { useCallback } from 'react'
import { Messages } from '@/model/user'
import { toast } from 'sonner'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { acceptMessageSchema } from '@/schemas/acceptMessages'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Apiresp } from '@/types/ApiResp'

export default function Dashboard() {


const {data : sessoin , status} = useSession()
const [messages , setMessages] = useState<Messages[]>([])
const [isSwitchLoading , setSwitchLoading] = useState(false)
const [ isloading , setIsLoading ] = useState(false)


const handleDeleteMessage = (messageID : string) => {
    setMessages(messages.filter((item) => item._id !== messages ))
}

const form = useForm<z.infer<typeof acceptMessageSchema>>({
  resolver : zodResolver(acceptMessageSchema)
  , defaultValues : {
    isAcceptingMsg : false
  }
})

const { register , watch , setValue } = form
const acceptMessages = watch('isAcceptingMsg')

const fetchIsAcceptingMessagee = useCallback(async()=>{
  setSwitchLoading(true)  
  try {
      const resp = await axios.get<Apiresp>('/api/accept-messages')
      setValue('isAcceptingMsg' , resp.data?.isAcceptingMsg as boolean)

    } catch (error) {
      const axiErr = error as AxiosError<Apiresp>
      const err = axiErr.response?.data.msg
      toast(err)
      console.log(err)
    
    }
    finally{
      setSwitchLoading(false)
    }
} , [setValue])

const fetchMessages = useCallback(  async(refresh : boolean)=>{
  setSwitchLoading(true)
  setIsLoading(true)
  try {
    const resp = await axios.get<Apiresp>('/api/get-messages')
    setMessages(resp.data?.messages || [])

    if(refresh){
      toast("Message Refreshed!")
    }

  } catch (error) {
    const axiErr = error as AxiosError<Apiresp>
    const err = axiErr.response?.data.msg
    toast(err)
    console.log(err)
  }
  finally{
    setIsLoading(false)
    setSwitchLoading(false)
  }
} , [ setIsLoading , setMessages ])

  return (
    <div>page</div>
  )
}
