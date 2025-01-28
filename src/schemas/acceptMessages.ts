import {z} from 'zod'

export const acceptMessageSchema = z.object({
    isAcceptingMsg  : z.boolean()
})
