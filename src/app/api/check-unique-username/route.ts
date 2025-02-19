import DBconnect from "@/lib/DBconnect";
import {z} from 'zod'
import { UserModel } from "@/model/user";
import { userNameVal } from "@/schemas/userSingUp";
import { NextResponse } from "next/server";
const UsernameQurySchema = z.object({
    username : userNameVal
})

export async function GET(request : Request) {
    if(request.method !== "GET"){
        return NextResponse.json({
            success : false
            ,msg : 'Method not allowed'
        } , {status : 500}
    )
    }
    await DBconnect()
    try {

        const { searchParams } = new URL(request.url)
        const queryparam = {
            username : searchParams.get('username')
        }
        
        //username validation
        const result = UsernameQurySchema.safeParse(queryparam)
        
        console.log(result)
        
        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            console.error(usernameError)
            return NextResponse.json({success : false , msg : usernameError?.length > 0? usernameError.join(', '):'Invalid username params!' , usernameError}, {status : 400})
        }

        const { username } = result.data
        console.log(username)
        const userExistsAndVerified = await UserModel.findOne({username , isVerified : true})
        if(userExistsAndVerified){
            return NextResponse.json({success : false , msg : 'Username in use'} , {status : 400})
        }
        return NextResponse.json({success : true , msg : 'Username is Unique'} , {status : 200})

    } catch (error) {
        console.error(error)
        return NextResponse.json({
            success : false,
            msg : "Error in trycatch block of username query" ,error
        },
        {
            status : 500
        }
    )
    }
}