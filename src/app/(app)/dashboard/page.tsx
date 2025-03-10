'use client'

import React, { useCallback, useEffect } from 'react'
import { Messages } from '@/model/user'
import { toast } from 'sonner'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import { Apiresp } from '@/types/ApiResp'
import { Loader2, RefreshCcw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import MessagePanel from '../../../components/messagePanel/page'
import copy from "copy-to-clipboard";

export default function Dashboard() {


  const { data: sessoin, status } = useSession()

  const [messages, setMessages] = useState<Messages[]>([])
  const [isSwitchLoading, setSwitchLoading] = useState(false)
  const [isloading, setIsLoading] = useState(false)
  const [isAcceptingMsgState, SetacceptingMsgState] = useState(false)


  const handleDeleteMessage = (messageID: string) => {
    setMessages(messages.filter((item) => item._id !== messageID))
  }

  // Important notes : useCallback doesnt call nor ignite the provided func, rather it caches it so the provided func dont have to be rebulit by interpretter

  // fetches isAccepting state of logged user, rebulits itself on setValue manupulation by user

  const fetchIsAcceptingMessagee = useCallback(async () => {
    setSwitchLoading(true)
    try {
      const resp = await axios.get<Apiresp>('/api/accept-messages', { withCredentials: true })

      SetacceptingMsgState(resp.data?.isAcceptingMsg as boolean || false)

      console.log(isAcceptingMsgState)

    } catch (error) {
      const axiErr = error as AxiosError<Apiresp>
      const err = axiErr.response?.data.msg
      toast(err)
      console.log(err)

    }
    finally {
      setSwitchLoading(false)
    }
  }, [toast, SetacceptingMsgState])


  // fetches messages when even called, the dependencies track setState values not just State values, as a result it only run on mount and referesh.

  const fetchMessages = useCallback(async (refresh: boolean = true) => {
    setSwitchLoading(true);
    setIsLoading(true);

    try {
      const resp = await axios.get<Apiresp>('/api/get-messages');
      setMessages(resp.data?.messages || []);

      if (refresh) {
        toast("Message Refreshed!");
      }
    } catch (error) {
      const axiErr = error as AxiosError<Apiresp>;
      const err = axiErr.response?.data.msg || "An error occurred";
      toast(err);
      console.error(err);
    } finally {
      setIsLoading(false);
      setSwitchLoading(false);
    }
  }, [setSwitchLoading, setIsLoading, setMessages, toast]);

  // useEffect hook that runs based on if the session contains proper info and if setValue state gets manupulated by user

  useEffect(() => {
    if (!sessoin || !sessoin.user) {
      return
    }

    fetchMessages()
    fetchIsAcceptingMessagee()

  }, [sessoin, isAcceptingMsgState])

  //  handle switch change


  const handleSwitchChange = async (state : boolean) => {
    setSwitchLoading(true)
    try {
      const resp = await axios.post('/api/accept-messages', { acceptingMessage: state })
      SetacceptingMsgState(resp.data?.isAcceptingMsg)

    } catch (error) {
      const axiErr = error as AxiosError<Apiresp>
      const err = axiErr.response?.data.msg
      toast(`Erorr : ${err}`)

    }finally{
      setSwitchLoading(false)
    }
  }

  const [profileUrl, setProfileUrl] = useState('')

  useEffect(() => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/send-Text?u=${sessoin?.user.username as string || "notFound"}`
    setProfileUrl(profileUrl)
  }, [isloading, isSwitchLoading])


  if (!sessoin || !sessoin?.user) {
    return <>
      <div>Please Login First.</div>
    </>
  }


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={() => {
            copy(profileUrl)
            toast("URL Copied!")
            }}>Copy</Button>

        </div>
      </div>

      <div className="mb-4">
        <span>Privacy : </span>
        <Button style={{margin : '10px'}} disabled={!isAcceptingMsgState} onClick={() => {
          handleSwitchChange(false)
        }} >Private</Button>
        <Button style={{margin : '10px'}} disabled={isAcceptingMsgState} onClick={() => {
          handleSwitchChange(true)
        }}>Open</Button>

        <span className="ml-2">
          Accept Messages: {isAcceptingMsgState ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages();
        }}
      >
        {isloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">

        {messages?.length > 0 ? (
          messages.map((message, index) => (
            <MessagePanel
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}
