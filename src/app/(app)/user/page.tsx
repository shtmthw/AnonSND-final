"use client"

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { User } from '@/model/user'
import { toast } from 'sonner'
import { Apiresp } from '@/types/ApiResp'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"

export default function Userpage() {
  const params = useSearchParams()
  const username = params.get('u')
  const [userInfo, setUserInfo] = useState<User>()
  const [message, setMessage] = useState('')

  const onMessageSent = async () => {
    try {
      const response = await axios.post('/api/send-message', { username: username, content: message })
      toast(response.data.msg)
      setMessage('')
    } catch (error) {
      const axiErr = error as AxiosError<Apiresp>
      const Rerror = axiErr.response?.data.msg
      toast(`Error in CB : ${Rerror}`)
    }
  }

  useEffect(() => {
    const getUserInfo = async () => {
      if (username) {
        try {
          const getUserInfo = await axios.post('/api/get-user-info', { username: username })
          setUserInfo(getUserInfo.data.user)
        } catch (error) {
          const axiErr = error as AxiosError<Apiresp>
          const Rerror = axiErr.response?.data.msg
          toast(`Error in CB : ${Rerror}`)
        }
      }
    }

    getUserInfo()
  }, [username])

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Profile Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">{userInfo?.username}</h1>
        <p className="text-sm text-gray-500 mt-1">An AnonSND verified account.</p>
      </div>

      <Separator className="my-4" />

      {/* Profile Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Account Status:</span>
          <span className={`text-sm font-semibold ${userInfo?.isAcceptingMsg ? 'text-green-600' : 'text-red-600'}`}>
            {userInfo?.isAcceptingMsg ? 'Open' : 'Private'}
          </span>
        </div>

        <Separator className="my-2" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Email:</span>
          <span className="text-sm text-gray-600">{userInfo?.email}</span>
        </div>

        {/* Message Input (Only if user is accepting messages) */}
        {userInfo?.isAcceptingMsg && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Send a message to user..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={onMessageSent}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Send Message
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}