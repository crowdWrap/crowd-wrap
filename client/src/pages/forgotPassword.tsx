import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Highlight,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  PinInput,
  PinInputField,
  Text,
} from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Form, Link as ReactLink } from "react-router-dom";
import SignInGoogle from "../api/googleSignin";
import backgroundImage from ".././assets/image_group/blue-pink-better-theme.png";
import { useState } from "react";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [codePage, setCodePage] = useState(false);
  const [enterPass, setEnterPass] = useState(false);
  const [complete, setComplete] = useState(false);
  const handleSubmit = () => {
    if (enterPass) {
    } else if (codePage && complete) {
      setEnterPass(true);
    } else {
      setCodePage(true);
    }
  };
  return (
    <Flex
      borderColor={"red"}
      height="100vh"
      backgroundPosition="40%"
      position="absolute"
      top="0px"
      width="100vw"
      objectFit="cover"
      justifyContent={"center"}
      alignItems="center"
      filter="hue-rotate(0deg)"
      backgroundImage={backgroundImage}
    >
      <Box
        bgColor="white"
        borderRadius="25px"
        p="60px 40px"
        boxShadow="0px 0px 5px rgba(0, 0, 0, 0.265)"
        filter="hue-rotate(0deg)"
      >
        <Heading letterSpacing="-1px" fontWeight="700" marginBottom="10px">
          Forgot Password?
        </Heading>
        <Text
          color="gray.800"
          marginLeft="2px"
          fontWeight="200"
          marginBottom="25px"
        >
          {!codePage
            ? "No worries, we'll send you reset instructions"
            : !enterPass
            ? "Enter the code sent to the associated email"
            : "Enter your new password"}
        </Text>

        <Form onSubmit={handleSubmit}>
          <Flex alignItems="center" gap="30px" flexDir="column">
            {!codePage ? (
              <FormControl variant="floating" id="usernameEmail" isRequired>
                <Input placeholder=" " />
                <FormLabel bg="white">Username or Email</FormLabel>
              </FormControl>
            ) : !enterPass ? (
              <HStack>
                <PinInput
                  autoFocus
                  onComplete={() => setComplete(true)}
                  type="alphanumeric"
                >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            ) : (
              <Input />
            )}

            <Flex width="100%" flexDir="row" gap="8px">
              {codePage && !enterPass && (
                <Button
                  isLoading={loading}
                  flexGrow="1"
                  // width="100%"
                  onClick={() => setCodePage(false)}
                  colorScheme="gray"
                >
                  Back
                </Button>
              )}
              <Button
                isLoading={loading}
                flexGrow="1"
                type="submit"
                colorScheme="pink"
              >
                {!enterPass ? "Next" : "Submit"}
              </Button>
            </Flex>

            <Flex alignItems="center" gap="5px" flexDirection="column">
              <Link as={ReactLink} to="/login" color="teal.500">
                {"<- "} Sign in
              </Link>
            </Flex>
          </Flex>
        </Form>
      </Box>
    </Flex>
  );
}
