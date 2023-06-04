import React, { useEffect } from "react";
import { Form, Link as ReactLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignInGoogle from "../../api/googleSignin";
import { useAuth } from "../../hooks/authContext";
import backgroundImage from "../.././assets/image_group/blue-pink-better-theme.png";

import "@fontsource/inter";

import {
  FormControl,
  FormLabel,
  Input,
  Link,
  Box,
  Flex,
  InputGroup,
  InputRightElement,
  Button,
  Heading,
  Text,
  useToast,
  Highlight,
} from "@chakra-ui/react";

export default function LoginForm() {
  const navigate = useNavigate();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/profile" } };
  const [usernameOrEmail, setusernameOrEmail] = useState<string>("");
  const [loginPass, setLoginPassword] = useState<string>("");
  const { authed, setAuthed, needsUsername } = useAuth();
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  useEffect(() => {
    if (authed && !needsUsername) {
      navigate(from);
    } else if (needsUsername) {
      navigate("/register/setUsername");
    }
  }, [authed, from, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const data = JSON.stringify({
      username: usernameOrEmail,
      password: loginPass,
    });

    const response: Response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const receivedData = await response.json();

    if (response.ok) {
      toast({
        title: "Login Succesful.",
        description: `${receivedData.message}`,
        status: "success",
        duration: 4000,
      });
      setAuthed(true);
      setLoading(false);
    } else {
      toast({
        title: "Login failed.",
        description: `${receivedData.message}.`,
        status: "error",
        duration: 4000,
      });
    }
  }

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
      backgroundImage={backgroundImage}
    >
      <Box
        bgColor="white"
        borderRadius="25px"
        p="60px 40px"
        boxShadow="0px 0px 5px rgba(0, 0, 0, 0.265)"
      >
        <Heading fontWeight="400" marginBottom="10px">
          Login
        </Heading>
        <Text fontWeight="200" marginBottom="25px">
          <Highlight
            styles={{ px: "1", py: "1", rounded: "full", bg: "red.100" }}
            query={"social"}
          >
            Gifting, but make it social
          </Highlight>
        </Text>
        <Form onSubmit={handleSubmit}>
          <Flex gap="30px" flexDir="column">
            <FormControl variant="floating" id="usernameEmail" isRequired>
              <Input
                placeholder=" "
                onChange={(e) => setusernameOrEmail(e.target.value)}
              />
              <FormLabel>Username or Email</FormLabel>
            </FormControl>
            <FormControl variant="floating" id="password" isRequired>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder=" "
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <FormLabel>Password</FormLabel>
                <InputRightElement width="4.5rem">
                  <Button
                    marginTop="auto"
                    marginBottom="auto"
                    variant="outline"
                    colorScheme="blue"
                    h="1.75rem"
                    size="sm"
                    onClick={handleClick}
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Flex flexDir="row" gap="8px">
              {loading ? (
                <Button flexGrow="1" isLoading type="submit" colorScheme="pink">
                  Sign in
                </Button>
              ) : (
                <Button flexGrow="1" type="submit" colorScheme="pink">
                  Sign in
                </Button>
              )}
              {/* <Button colorScheme="red" padding="0"> */}
              <GoogleOAuthProvider
                clientId={`${process.env.REACT_APP_CLIENTID}`}
              >
                <SignInGoogle loading={loading} setLoading={setLoading} />
              </GoogleOAuthProvider>
              {/* </Button> */}
            </Flex>

            <Flex alignItems="center" gap="5px" flexDirection="column">
              <Text>
                Dont have an account?{" "}
                <Link as={ReactLink} to="/register" color="teal.500">
                  Sign up
                </Link>
              </Text>

              {/* <Text >
              <Link color="teal.500">Forgot Password?</Link>{" "}
            </Text>
            <Text >
              <Link color="teal.500">Need help?</Link>{" "}
            </Text> */}
            </Flex>
          </Flex>
        </Form>
      </Box>
    </Flex>
  );
}
