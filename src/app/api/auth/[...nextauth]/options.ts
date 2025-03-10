import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import GoogleProvider from "next-auth/providers/google";
import { UserModel } from '@/model/user'
import DBconnect from '@/lib/DBconnect'
interface Credentials {
    identifier: string;
    password: string; // Added password to the interface
}

export const authOptions: NextAuthOptions = {
    providers: [
        //doesnt work either when using localhast shit ass
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            async profile(profile):Promise<any> {
                
                await DBconnect()
                try {
                    
                    const user = await UserModel.findOne({ email : profile.email })
                    
                    if(!user){
                        throw new Error("User With This Email Doesnt Exist.")
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your account before continuing.")
                    }

                    return{
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        isVerified: user.isVerified,
                        isAcceptingMsg: user.isAcceptingMsg,
                    }

                } catch (e : any) {
                    console.error("Google Auth Error:", e);
                    throw new Error(`Error occurred while authenticating via authjs: ${e.message}`);
                    
                }
            }
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "identifier", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials?: Credentials): Promise<any> { // Use the correct interface `Credentials`
                await DBconnect();

                if(!credentials){
                    throw new Error('No Creds Provided.')
                }
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });

                    if (!user) {
                        throw new Error("No user found!");
                    }
                    
                    if (!user.isVerified) {
                        throw new Error("Please verify your account before continuing.");
                    }

                    const isPassMatching = await bcrypt.compare(credentials.password, user.password);

                    if (!isPassMatching) {
                        throw new Error("Password is incorrect!");
                    }

                    return {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        isVerified: user.isVerified,
                        isAcceptingMsg: user.isAcceptingMsg,
                    };

                } catch (e: any) {
                    console.error("Manual Auth Error:", e);
                    throw new Error(`Error occurred while authenticating via authjs: ${e.message}`);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMsg = user.isAcceptingMsg;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isAcceptingMsg = token.isAcceptingMsg;
                session.user.isVerified = token.isVerified;
            }
            return session;
        }
    },
    pages: {
        signIn: '/sign-in',
        error: '/auth/error', // Custom error page
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
};
