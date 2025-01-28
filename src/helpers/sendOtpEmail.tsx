import { Resend } from "resend";
import { OTPcodeEmail } from "../../emailTemps/validationCode";
import { Apiresp } from "@/types/ApiResp";

// Create an instance of Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  username: string,
  email: string,
  otp: string
): Promise<Apiresp> {
  try {
    // Send the email using the React component directly
    await resend.emails.send({
      from: "hqAnonSnd@gmail.com",
      to: email,
      subject: "AnonSnd OTP code",
      react: <OTPcodeEmail username={username} otp={otp} />, // Pass the React component directly
    });

    return { success: true, message: "Sent OTP email" };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, message: "Failed to send OTP email" };
  }
}
