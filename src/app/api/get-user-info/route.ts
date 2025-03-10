import { UserModel } from "@/model/user"
import { NextResponse } from "next/server"


export async function POST(requset : Request) {
   
    try {
        
        const { username } = await requset.json()

        if(!username){
            return NextResponse.json({
                success : false ,
                msg : 'No Username sent'
            } , { status : 401 })
        }

        const user = await UserModel.findOne({username})
        
        if(!user){
            return NextResponse.json({
                success : false ,
                msg : 'No user found.'
            } , { status : 404 })
        }

        return NextResponse.json({
            success : true ,
            user : user,
            msg : 'User found.'
        } , { status : 200 })

    } catch (error) {
        return NextResponse.json({
            success : true ,
            msg : `Error in cb : ${error}`
        } , { status : 500 })
    }
}