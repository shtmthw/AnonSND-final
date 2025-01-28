import {z} from 'zod'

const msgValidtion = z.string().min(2).max(300 , {message  : 'Message too long!'})

export const messageSchema = z.object({
    message : msgValidtion
})