import { Flex, Heading, Highlight, Box, Text, Image } from "@chakra-ui/react";
import { Form, useNavigate } from "react-router-dom";

export default function LoginAndSignupPage({ signup, children }: any) {
  const navigate = useNavigate();
  return (
    <Flex position="absolute" width="100%" height="100vh">
      <Flex flexShrink="0" flexGrow="1" justifyContent="center" minWidth="35%">
        <Flex width="70%" marginTop="40%" alignItems="center" flexDir="column">
          <Flex
            width="100%"
            marginBottom="40px"
            flexDir="column"
            // alignItems="center"
          >
            {signup ? (
              <>
                <Heading
                  letterSpacing="-1px"
                  marginBottom="4px"
                  fontWeight="700"
                >
                  Create an account
                </Heading>
                <Text
                  marginLeft="0.5"
                  letterSpacing="-0.5px"
                  color="gray.600"
                  fontWeight="200"
                >
                  <Highlight
                    styles={{
                      px: "1",
                      py: "1",
                      rounded: "full",
                      bg: "red.100",
                    }}
                    query={"social"}
                  >
                    Gifting, but make it social
                  </Highlight>
                </Text>
              </>
            ) : (
              <>
                <Heading
                  letterSpacing="-1px"
                  marginBottom="4px"
                  fontWeight="700"
                >
                  Welcome
                </Heading>
                <Text
                  marginLeft="0.5"
                  letterSpacing="-0.5px"
                  color="gray.600"
                  fontWeight="200"
                >
                  Please enter your details to log in!
                </Text>
              </>
            )}
          </Flex>
          {children}
        </Flex>
      </Flex>
      <Image
        borderStartRadius="5px"
        maxWidth="70%"
        objectFit="cover"
        onClick={() => navigate("/")}
        cursor={"pointer"}
        src="https://images.unsplash.com/photo-1520763185298-1b434c919102?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80"
      />
    </Flex>
  );
}
