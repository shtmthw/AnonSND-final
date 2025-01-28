import {z} from 'zod'

export const singIn = z.object({
    identifier : z.string(),
    password : z.string({message : 'Invalid Password.'})
})