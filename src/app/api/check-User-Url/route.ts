import DBconnect from "@/lib/DBconnect"
import { UserModel } from "@/model/user"
import { User } from "lucide-react"
import { NextResponse } from "next/server"


export async function POST(request : Request) {
        await DBconnect()
    try {
        const { username } = await request.json()

        if(!username){
            return NextResponse.json({
                success : false,
                msg : "Username Not Provided."
            } , {status : 401})
        }

        const user = await UserModel.findOne( { username } )

        if(!user){
            return NextResponse.json({
                success : false,
                msg : "User Doesnt Exist."
            } , {status : 401} )
        }

        return NextResponse.json({
            success : true,
            msg : "User Found",
            username : user.username

        } , {status : 200})

    } catch (error) {
        return NextResponse.json({
            success : false,
            msg : `Error : ${error} `,
        } , {status : 500})
    }
}