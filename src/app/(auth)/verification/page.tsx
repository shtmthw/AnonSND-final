'use client'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { verifyCodeSchema } from '@/schemas/verficationCode'
import { Apiresp } from '@/types/ApiResp'
import { FormItem } from '@/components/ui/form'
import { FormLabel } from '@/components/ui/form'
import { Form } from '@/components/ui/form'
import { FormControl } from '@/components/ui/form'
import axios, { AxiosError } from 'axios'
import { FormMessage } from '@/components/ui/form'
import * as LR from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function Verification(){

    const [isSubmitting , setIsSubmitting] = useState(false)
    
    const router = useRouter()
    const param = useSearchParams()
    const username = param.get('username')
    const form = useForm<z.infer<typeof verifyCodeSchema>>(
    {
        resolver : zodResolver(verifyCodeSchema),
        defaultValues : {
            code : ""
        }
    }
    )



    const onSubmit = async(data : z.infer<typeof verifyCodeSchema>) => {
        setIsSubmitting(true)
        
        try{
            const request = await axios.post('/api/verifyUser' ,  {username : username , verifycode : data.code} )
            toast(`${request.data.msg}`)
            router.replace('/sing-in')
        }catch(error){
            
            const axioErr = error as AxiosError<Apiresp>
            const readableErr = axioErr.response?.data.msg
            toast(`Error Occured! | err : ${readableErr}`)

        }finally{
            setIsSubmitting(false)
        }
        
   
    }   

    return(
        <div className='flex justify-center items-center
        min-h-screen bg-gray-100'>
          <div className='w-full max-w-md p-8 space-y-8 bg-white-rounded-lg shadow-md'>
            <div className='text-center'>
              <h1 className='text-4xl front-extrabold tracking-tight lg:text-5xl mb-6'>
                Get Verified.
              </h1>
              <p className="mb-4">Check Your Email For The Code.</p>
              <div className="resendVerificationCode">
    
              </div>
            </div>
            <div>
            </div>
            {/* FORM */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Handles the submit if the useForm hook accepts the form and the fields get successfully verified. */}
                <FormField
                  control={form.control} //connects the feild to react hook form
                  name="code"//name of the feild
                  render={({ field }) => (
                    //gets the other fields like onBlur , onClick from the form by default
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input placeholder="code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <Button style={{margin:'10px' , marginLeft:'150px'}} disabled={isSubmitting} type='submit'>{
                  isSubmitting ? (
                    <>
                      <LR.Loader2 className='mr-2 h-4 w-4 animate-spin' />Please Wait
                    </>
                  ) : "Verify"
                }</Button>
    

              </form>
            </Form>
            {/* FORM */}
    
          </div>
        </div>
      )
}


export default Verification