import 'next-auth'
import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
declare module 'next-auth'{
    interface User{
        _id? : string
        isVerified? : boolean
        isAcceptingMsg : boolean
        username : string
    }

    // the User interface above is used for typesafety of all user encounters, the one below will only affect the 
    // Session in nextauth callbacks.
    interface Session{
        user:{
            _id? : string
            isVerified? : boolean
            isAcceptingMsg : boolean
            username : string
        } & DefaultSession['user'] 
    }
}
declare module 'next-auth/jwt'{
    interface JWT{
        _id? : string
        isVerified? : boolean
        isAcceptingMsg : boolean
        username : string
    }
}