import { getServerSession } from "next-auth"; 
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModel } from "@/model/user";
import DBconnect from "@/lib/DBconnect";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function GET(request : Request) {
        await DBconnect()

            const session = await getServerSession(authOptions)
            const user : User =  session?.user as User
            
            if(!session || !session.user){
                return NextResponse.json({
                    success : false,
                    msg : "User not logged in, session.user cant be found !"
                } , {status : 404})
            }
            //coming from the frontend based on users choice
            const userID =  new mongoose.Types.ObjectId(user._id)
            
            try {

                const user = await UserModel.aggregate([
                    {$match : {_id : userID}}
                    ,{$unwind : '$messages'}
                    ,{$sort : {'messages.date' : -1}}
                    ,{$group : {_id : '$_id' , messages : {$push : '$messages'}}}
                ])

                if(!user || user.length === 0){
                    return NextResponse.json({
                        success : false,
                        msg : 'User not found'
                    }, {status : 401})
                }
                return NextResponse.json({
                    success : true,
                    msg : "Successfully fetcheed messages",
                    messages :  user[0].messages
                }, {status : 200})

            } catch (error) {
                return NextResponse.json({
                    success : false,
                    msg : 'err in catch block' ,
                    error : error
                }, {status : 500})
            }
        }
    