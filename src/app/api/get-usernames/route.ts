import DBconnect from "@/lib/DBconnect"
import { UserModel } from "@/model/user"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    await DBconnect()
    try {
        const { username } = await req.json()

        if (!username) {
            return NextResponse.json({
                success: false,
                msg: 'Username not given'
            }, { status: 400 })
        }


        // MongoDB query to find usernames that start with the provided search term (case-insensitive)
        const users = await UserModel.find({
            username: { $regex: `^${username}`, $options: 'i' }
        }).limit(10)  // Limit the result to the first 10 matches (optional)

        // If no users are found
        if (users.length === 0) {
            return NextResponse.json({
                success: false,
                msg: 'No users found'
            }, { status: 404 })  // 404 status if no users match
        }

        // Return the list of matching usernames
        const usernames = users.map(user => user.username)

        return NextResponse.json({
            success: true,
            usernames,
            msg: 'Users fetched successfully'
        }, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            success: false,
        
            msg: `error in CB ${error}`
        }, { status: 500 })
    }
}