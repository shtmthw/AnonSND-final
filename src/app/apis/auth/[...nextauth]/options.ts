import {NextAuthOptions} from 'next-auth'
import  CredentialsProvider  from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { UserModel } from '@/model/user'
import DBconnet from '@/lib/DBconnect'

export const authOptions : NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name : 'Credentials',
            credentials : {
                username : {label : "Email" , type: "text" },
                password : {label : "Password" , type : "password"}
            },
            async  authorize(credentials : any) : Promise<any>  {
                await DBconnet()
                try{
                    const user = await UserModel.findOne({
                        $or:[
                            {username : credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found!")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account before countinuing")
                    }
                    const isPassMatching = await bcrypt.compare(credentials.password , user.password)
                    
                    if(!isPassMatching){
                        throw new Error("Password is inccorect!")
                    }
                    return user

                }catch(e : any){
                    throw new Error("error occured while authenticating via authjs" , e)
                }
            }   
        })
    ],
    callbacks : {
        async jwt({token , user}){
            if(user){

                token._id  = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMsg = user.isAcceptingMsg

            }
            return token
        },
        async session({session , token}){
            if(token){
                session.user._id = token._id
                session.user.username = token.username
                session.user.isAcceptingMsg = token.isAcceptingMsg
                session.user.isVerified = token.isVerified
            }
            return session
        }
    },
    pages : {
        signIn : '/singIn'
    },

    session : {
        strategy : 'jwt'
    },

    secret : process.env.NEXTAUTH_SECRET
} 