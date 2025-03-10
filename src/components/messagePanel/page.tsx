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

interface MessagePanelProps {
    message: Messages,
    onMessageDelete: (messageID: string) => void
}

export default function MessagePanel({   message, onMessageDelete }: MessagePanelProps) {

    const handleDeleteConfirm = async () => {
        try {
            const result = await axios.post('/api/delete-message', { messageID : message._id });
            toast(result.data.msg);
            onMessageDelete(message._id as string);
        } catch (error) {
            toast('Error while deleting the message');
            console.log(error);
        }
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{message.content}</CardTitle>
                    <CardDescription>sent at : {message.date as any}</CardDescription>

                    <AlertDialog>
                        <AlertDialogTrigger>
                            <button className="btn btn-danger">Delete Message</button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your message and remove it from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardHeader>

            </Card>
        </div>
    )
}
