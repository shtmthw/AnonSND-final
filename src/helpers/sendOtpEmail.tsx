import { Resend } from "resend";
import ReactDOMServer from "react-dom/server";
import { Email } from "../../emailTemps/validationCode";  // Your email component
import { Apiresp } from "@/types/ApiResp";

// Create an instance of Resend
const resend = new Resend("re_GaBB6vaN_7zdt8CsbPepVDxBvtkAMQ5qU");

export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<Apiresp> {
  try {
    // Render the React component to static HTML
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      <Email username={username} otp={verifyCode} />
    );

    // Send the email using the rendered HTML content
    await resend.emails.send({
      from: "hqAnonSnd@gmail.com",
      to: email,
      subject: "AnonSnd OTP code",
      html: htmlContent, // Send the static HTML string
    });

    return { success: true, message: "Sent OTP email" };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, message: "Failed to send OTP email" };
  }
}
