import { getServerSession } from "next-auth"; 
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModel } from "@/model/user";
import DBconnect from "@/lib/DBconnect";
import { User } from "next-auth";
import { NextResponse } from "next/server";




export async function POST(request : Request) {
        await DBconnect()
        try {
            const session = await getServerSession(authOptions)

            const user : User =  session?.user as User
            
            console.log(session?.user)

            if(!session || !session.user){
                return NextResponse.json({
                    success : false,
                    msg : "User not logged in, session.user cant be found !"
                } , {status : 404})
            }
            //coming from the frontend based on users choice
            const userID =  user._id
            const { acceptingMessage } = await request.json()

            const updatedUser = await UserModel.findByIdAndUpdate(
                userID,
                { isAcceptingMsg : acceptingMessage},    
                { new : true }
            )

            if(!updatedUser){
                return NextResponse.json({
                    success : false,
                    msg : "Failed Updating User."
                } , {status : 401})
            }

            return NextResponse.json({
                success : true,
                msg : "Updated User Status."
            } , {status : 200})

        } catch (error) {
            return NextResponse.json({
                success : false,
                msg : "Error in the catch block while changing isAccepting state"
            } , {status : 500})
        }    
}

export async function GET(request:Request) {
    await DBconnect()
    try {
        const session = await getServerSession(authOptions)

        const user : User =  session?.user as User
        
        if(!session || !session.user){
            return NextResponse.json({
                success : false,
                msg : "User not logged in, session.user cant be found !"
            } , {status : 404})
        }
        //coming from the frontend based on users choice
        const userID =  user._id

        const foundUser = await UserModel.findById(
            userID,
        )

        if(!foundUser){
            return NextResponse.json({
                success : false,
                msg : "Not any user found."
            } , {status : 401})
        }

        return NextResponse.json({
            success : true,
            msg : "User found.",
            isAcceptingMsg : foundUser.isAcceptingMsg
        } , {status : 200})

    } catch (error) {
        return NextResponse.json({
            success : false,
            msg : "Error in the catch block while getting isAccepting state"
        } , {status : 500})
    }    
}