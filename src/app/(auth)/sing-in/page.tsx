'use client'
import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/router'
import { singupSchema } from '@/schemas/userSingUp'
import { Apiresp } from '@/types/ApiResp'
import axios, { AxiosError } from 'axios'
function page() {
  const [usernameMsg , setUsernameMsg] = useState('')
  const [username , setUsername] = useState('')
  const [isCheckingUsername , setIsCheckingUsername] = useState(false)
  const [isSubmitting , setIsSubmitting] = useState(false)


  const router = useRouter()
  const debouncedUsername = useDebounceValue(username, 500)
  
  //zod usage
  const form = useForm<z.infer<typeof singupSchema>>({
      resolver : zodResolver(singupSchema),
      defaultValues : {
        username : '',
        email : "",
        password : ""
      }
  })

  useEffect(()=>{
    const checkUsername = async() => {
      if(debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMsg('')

        try {
          const resp = await axios.get(`/api/check-unique-username?username=${debouncedUsername}`)
          setUsernameMsg(resp.data.msg)
        } catch (error) {
          const axiosErr = error as AxiosError<Apiresp>
          setUsernameMsg(axiosErr.response?.data.msg ?? "err checking username" )
        }finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsername()
  }, [debouncedUsername])


  return (
    <div>page</div>
  )
}

export default page