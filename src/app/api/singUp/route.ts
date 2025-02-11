import { NextResponse } from 'next/server';
import DBconnect from "@/lib/DBconnect";
import { UserModel } from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendOtpEmail";
import nodemailer from 'nodemailer'
import dotenv from "dotenv";
dotenv.config();

export async function POST(request: Request) {
  await DBconnect();

  try {
    const { username, email, password } = await request.json();

    // Check if the required fields are provided
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, msg: "User didn't provide required info!" },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const isEmailExisting = await UserModel.findOne({ email });

    if (isEmailExisting) {
      const passwordMatching = await bcrypt.compare(password, isEmailExisting.password);

      if (isEmailExisting.isVerified && passwordMatching) {
        return NextResponse.json(
          { success: false, msg: "Email is in use and verified." },
          { status: 400 }
        );
      } else if (!isEmailExisting.isVerified && passwordMatching) {
        return NextResponse.json(
          { success: false, msg: "Email in use and is not verified, check your email for the code." },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { success: false, msg: "Password incorrect" },
          { status: 401 }
        );
      }
    }

    // If email doesn't exist, create a new user
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiringDate = new Date(Date.now() + 3600000);
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPass,
      verifyCode,
      verifyCodeExpiry: codeExpiringDate,
      isAcceptingMsg: true,
      isVerified: false,
      messages: [],
    });

    //node mailer alt, use if resend is bitching on you :')

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "",  // Must match "from"
        pass: "",
      }
    });

    // send mail
    try {

      await transporter.sendMail({
        from: "",  // Ensure this matches SMTP_USER
        to: email,
        subject: `OTP code for AnonSND user`,
        html: `
          <p>Hello ${username},</p>
          <p>Email: ${email}</p>
          <p>Here is your OTP:</p>
          <h2>${verifyCode}</h2>
          <p>This code expires in 15 minutes.</p>
        `,
      });

    } catch (error) {
        return NextResponse.json({ message: "COULD NOT SEND MESSAGE" , error : error } , {status : 500})
    }

    await newUser.save();

    // Send verification email
    // const emailResponse = await sendVerificationEmail(username, email, verifyCode);
    // if (!emailResponse.success) {
    //   return NextResponse.json(
    //     { success: false, msg: emailResponse.message },
    //     { status: 500 }
    //   );
    // }
    return NextResponse.json(
      { success: true, msg: "User successfully registered and verification email sent."},
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, msg: "Error during signup" },
      { status: 500 }
    );
  }
}
