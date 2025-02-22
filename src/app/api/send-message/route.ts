import { UserModel } from "@/model/user";
import DBconnect from "@/lib/DBconnect";
import { Messages } from '@/model/user'
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await DBconnect()

    try {

        const { username, content } = await request.json()

        if (!username || !content) {
            return NextResponse.json({
                success: false,
                msg: 'Credentians and/or contents not given.'
            }, { status: 402 })
        }

        const user = await UserModel.findOne({ username })

        if (!user) {
            return NextResponse.json({
                success: false,
                msg: 'User not found.'
            })
        }

        if (!user.isAcceptingMsg) {
            return NextResponse.json({
                success: false,
                msg: 'User not accepting messages.'
            }, {status : 402})
        }

        const newMsg = { content, date: new Date() }
        user.messages.push(newMsg as Messages)
        await user.save()

        return NextResponse.json({
            success: true,
            msg: 'Successfully sent.'
        } , {status : 200})

    } catch (error) {
        return NextResponse.json({
            success: false,
            msg: 'err in catch block',
            error: error
        }, { status: 500 })
    }
}