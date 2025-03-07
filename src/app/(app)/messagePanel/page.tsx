'use client'
import React from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { toast } from 'sonner'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from 'axios'
import { Apiresp } from '@/types/ApiResp'
import { Messages } from '@/model/user'



interface messagePanelProps {
    message : Messages,
    onMessageDelete :  (messageID : string) => void
}

export default function messagePanel( {message , onMessageDelete} : messagePanelProps ) {
    
    const handleDeleteConfirm = async() => {
        const result = await axios.delete<Apiresp>('/')

        toast(result.data.msg)

        onMessageDelete(message._id as string)
    }
    
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger>Open</AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                </CardContent>
            </Card>
        </div>
    )
}
