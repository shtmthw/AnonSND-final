import { NextResponse } from "next/server";
import DBconnect from "@/lib/DBconnect";
import { UserModel } from "@/model/user";

export async function POST(request: Request) {
    await DBconnect()
    try {

        const { username, verifycode } = await request.json()
        const decodedUname = decodeURIComponent(username)

        const ifUserExists = await UserModel.findOne({ username: decodedUname })

        if (!ifUserExists) {
            return NextResponse.json({
                success: false,
                msg: 'No user found with this name.'
            },
                {
                    status: 400
                }
            )
        }

        if (ifUserExists.isVerified) {
            return NextResponse.json({
                success: false,
                msg: 'User already verfied'
            },
                {
                    status: 400
                }
            )
        }


        const userExpiryDate = ifUserExists.verifyCodeExpiry || 0

        if (ifUserExists.verifyCode !== verifycode) {
            return NextResponse.json({
                success: false,
                msg: 'Wrong code given'
            },
                {
                    status: 400
                }
            )


        }

        else if (userExpiryDate < new Date()) {
            return NextResponse.json({
                success: false,
                msg: 'Timed out!..Visit the code resend page to recive verifycode.'
            },
                {
                    status: 400
                }
            )
        }

        ifUserExists.isVerified = true;
        ifUserExists.verifyCode = "redeemed"
        await ifUserExists.save()

        
        return NextResponse.json({
            success: true,
            msg: 'Successfully verified!'
        },
            {
                status: 200
            }
        )



    } catch (error) {
        return NextResponse.json({
            success: false,
            msg: 'Error in try catch block'
        },
            {
                status: 500
            }
        )
    }
}