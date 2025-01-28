import {z} from  'zod'
const userNameVal = z.string().min(3).max(12)

export const userSchema =z.object({
    username : userNameVal,
    email : z.string().email({message:'Invalid email'}),
    password : z.string().min(4 , {message : 'Must be atleast 4 char long'}).max(15, {message : 'Must be lower than 15 char'})

})