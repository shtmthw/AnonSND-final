"use client"
import React, { useEffect, useState, useRef } from 'react'
import { useDebouncedCallback } from '@mantine/hooks'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Apiresp } from '@/types/ApiResp'
export default function GetUserProfile() {
  const [userName, setUsername] = useState('')
  const [userNames, setUsernames] = useState<string[]>([])
  const route = useRouter()
  const ref = useRef<any>(null)

  const debouncer = (e: any) => {
    const timeoutInstance = ref.current || null

    if (timeoutInstance) {
      clearTimeout(timeoutInstance)
    }
    try {
      const newTimeoutInstance = setTimeout(() => {
        setUsername(e.target.value)
        setUsernames([])

      }, 400)

      ref.current = newTimeoutInstance
    } catch (error) {
      toast(`Error while debouncing: ${error}`)
    }
  }

  useEffect(() => {
    async function getUserNames() {
      try {
        const response = await axios.post('/api/get-usernames', { username: userName })
        setUsernames(response.data.usernames)
        toast(response.data.msg)
      } catch (error) {
        const axiErr = error as AxiosError<Apiresp>
        const Rerror = axiErr.response?.data.msg
        toast(`Error in CB: ${Rerror}`)
      }
    }
    getUserNames()
  }, [userName])

  return (
    <div className="space-y-4 p-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search User"
          onChange={(e) => { debouncer(e) }}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-lg z-10 max-h-60 overflow-y-auto">
          {userNames.length !== 0 && (
            <div className="space-y-1">
              {userNames.map((item, index) => (
                <Button
                  key={index}
                  variant="link"
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:ring-0"
                  onClick={() =>{ 
                    route.replace(`/user?u=${item}`)
                    setUsernames([])
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
