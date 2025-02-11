import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
  } from "@react-email/components";
import React from "react";
  
  interface OTPcodeEmailProps {
    username: string,
    otp : string
}
  
  export const Email = (props : OTPcodeEmailProps) => {
   return(
   <Html lang="en">
      <Head />
      <Preview>Thank you for joining our experience!</Preview>
      <Body>
        <Container >
          <Heading>AnonSnd.</Heading>
          <Text>
            Thank you {props.username} for joining our programme . We
            have sent you an OTP, please input this in the main website to have the full experience.
          </Text>
          <Container>
            <Text>{props.otp}</Text>
          </Container>
        </Container>
      </Body>
    </Html>
   )
  };
  
  export default Email
  