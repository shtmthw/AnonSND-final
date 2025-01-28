import DBconnet from "@/lib/DBconnect";
import { UserModel } from "@/model/user";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendOtpEmail";
import { fstat } from "fs";

export async function POST(request : Request) {
    await DBconnet()
    try{
        const {username , email , password} = await request.json()

        const isVerifiedAndExisting = await UserModel.findOne({
            username,
            isVerified : true
        })

        if(isVerifiedAndExisting){
            return Response.json({
                success : false,
                msg : "User verifed and already exists."
            })
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        const isEmailInUse = await UserModel.findOne({email})
        
        if(isEmailInUse){
           if(isVerifiedAndExisting){
            return Response.json({
                success : false,
                msg : "User with this email already exists."
            })
            }
            else{
                const hashedPass = (await bcrypt.hash(password,10)).toString()
                isEmailInUse.password = hashedPass
                isEmailInUse.verifyCode = verifyCode
                isEmailInUse.verifyCodeExpiry= new Date(Date.now() + 3600000)
                await isEmailInUse.save()
            }
        
        }else{

            const hashedPass = await bcrypt.hash(password , 10)
            const expdate = new Date()
            expdate.setHours(expdate.getHours()+1)
            const newUser =new UserModel({
                username,
                email,
                password:hashedPass,
                verifyCode,
                verifyCodeExpiry : expdate,
                isAcceptingMsg : true,
                isVerified : false,
                messages : []
            })
            await newUser.save()
        }

        //send vrification code email

        const emailResponse = await sendVerificationEmail(username , email , verifyCode)
        if(!emailResponse.success){
            return Response.json({
                success :false,
                msg : emailResponse.message
            })
        }
        return Response.json({
            success:true,
            msg:"User successfully registered."
        })
    }catch(e){
        console.log('error in the singup api, check fast niggga')
        return Response.json({
            success : false,
            msg : "failed singing up"
        },{
            status : 500
        })
    }
}