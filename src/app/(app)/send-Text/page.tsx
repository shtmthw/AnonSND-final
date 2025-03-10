'use client'

import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
import { Apiresp } from '@/types/ApiResp'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import * as lr from 'lucide-react'
export default function SendText() {
    const [aiSuggestedMSG, setAiSuggestedMSG] = useState('')
    const [message, setMessage] = useState('')
    const [username, setUsername] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const searchParams = useSearchParams()
    const u = searchParams.get('u')

    useEffect(() => {
        if (u) {
            setUsername(u)
        }
    }, [u])

    if (!username) {
        return <h1>Please Login To Continue</h1>
    }

    // Function to fetch AI suggested messages !!doesnt work need money ffs
    const suggestMessages = async () => {
        setLoading(true)
        try {
            const resp = await axios.get('/api/suggest-messages')
            setAiSuggestedMSG(resp.data)
            console.log(resp.data)
        } catch (error) {
            toast('Error while receiving AI suggested messages')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // Function to handle sending text message
    const handleSendText = async () => {
        setLoading(true)
        if (!message) {
            toast("Message cannot be empty")
            return
        }

        try {
            const resp = await axios.post('/api/send-message', { username: u, content: message })
            toast(`Text Sent! msg: ${resp.data.msg}`)
            setMessage('')
        } catch (error) {
            const axiErr = error as AxiosError<Apiresp>
            const Rerror = axiErr.response?.data.msg
            toast(Rerror || 'Error sending message')
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">ANONSND-PROTOCOL</h1>
                <p className="text-sm text-gray-500 mt-1">Anon Texting.</p>
            </div>

            {/* Message Input Section */}
            <div className="space-y-4">
                <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your heart down!!"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {loading ? <>
                    <lr.Loader2 />
                </> : <>
                    <Button
                        onClick={handleSendText}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Send
                    </Button>
                </>}

            </div>

            {/* AI Suggested Messages Section (Optional) */}

        </div>
    )
}