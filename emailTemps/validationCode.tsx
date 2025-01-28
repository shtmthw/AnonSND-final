import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
  } from "@react-email/components";
  
  interface OTPcodeEmailProps {
    username: string,
    otp : string
}
  
  export const OTPcodeEmail: React.FC<OTPcodeEmailProps> = ({
    username, otp
  }) => {
   return(
   <Html>
      <Head />
      <Preview>Thank you for joining our experience!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>AnonSnd.</Heading>
          <Text style={text}>
            Thank you {username} for joining our programme . We
            have sent you an OTP, please input this in the main website to have the full experience.
          </Text>
          <Container>
            <Text>{otp}</Text>
          </Container>
        </Container>
      </Body>
    </Html>
   )
  };
  
  
  const main = {
    backgroundColor: "#000000",
    margin: "0 auto",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  };
  
  const container = {
    margin: "auto",
    padding: "96px 20px 64px",
  };
  
  const h1 = {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "40px",
    margin: "0 0 20px",
  };
  
  const text = {
    color: "#aaaaaa",
    fontSize: "14px",
    lineHeight: "24px",
    margin: "0 0 40px",
  };