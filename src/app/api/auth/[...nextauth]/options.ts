import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { UserModel } from '@/model/user'
import DBconnect from '@/lib/DBconnect'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await DBconnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [{ email: credentials.email }] // Fixed field
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

                    return user;

                } catch (e: any) {
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
        signIn: '/sign-in' // Fixed typo,\,
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
};
