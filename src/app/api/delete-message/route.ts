import { UserModel } from "@/model/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import DBconnect from "@/lib/DBconnect";

export async function POST(request : Request){
    await DBconnect()
    
    try {

        const { messageID } = await request.json()

        const session : any = await getServerSession(authOptions);        
        
        if(!messageID){
            return NextResponse.json({
                
                success : false,
                msg : "UserID not recived."

            } , {status : 404})
        }

        if(!session?.user){
            return NextResponse.json({
                
                success : false,
                msg : "Please Login To Continue."

            } , {status : 404})
        }

        //fetch the user first

        const user = await UserModel.findOne({ email : session.user.email })

        if(!user){
            return NextResponse.json({
                
                success : false,
                msg : "User not found."

            } , {status : 404})
        }

        // remove message based on messageID

        interface message{
            _id : any, 
            content: string,
            date : Date
        }

        const updatedMessages = user.messages.filter(
            (item : message) => item._id.toString() !== messageID
          );        
        user.messages = updatedMessages
        await user.save()

        return NextResponse.json({
                
            success : true,
            msg : "Message Deleted."

        } , {status : 200})

    } catch (error) {
        return NextResponse.json({
                
            success : true,
            msg : `Try Block Err : ${error} `

        } , {status : 500})
    }
}