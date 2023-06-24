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
  Image,
  Divider,
} from "@chakra-ui/react";
import LoginAndSignupPage from "../../components/loginAndSignup/LoginAndSignupPage";

export default function LoginForm() {
  const navigate = useNavigate();
  let location = useLocation();
  let { from } = location.state || { from: { pathname: "/profile" } };
  const [usernameOrEmail, setusernameOrEmail] = useState<string>("");
  const [loginPass, setLoginPassword] = useState<string>("");
  const { authed, setAuthed, setUser } = useAuth();
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  useEffect(() => {
    if (authed) {
      navigate(from);
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
      setUser(receivedData.user);
      setAuthed(true);
    } else {
      toast({
        title: "Login failed.",
        description: `${receivedData.message}.`,
        status: "error",
        duration: 4000,
      });
    }
    setLoading(false);
  }

  return (
    <LoginAndSignupPage signup={false}>
      <Box width="100%">
        <Form onSubmit={handleSubmit}>
          <Flex position="relative" width="100%" gap="32px" flexDir="column">
            <FormControl variant="floating" id="usernameEmail" isRequired>
              <Input
                placeholder=" "
                onChange={(e) => setusernameOrEmail(e.target.value)}
              />
              <FormLabel bg="white">Username or Email</FormLabel>
            </FormControl>
            <FormControl variant="floating" id="password" isRequired>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder=" "
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <FormLabel bg="white">Password</FormLabel>
                <InputRightElement width="4.5rem">
                  <Button
                    marginTop="auto"
                    marginBottom="auto"
                    variant="outline"
                    colorScheme="blue"
                    h="1.5rem"
                    marginRight="0.2rem"
                    size="sm"
                    onClick={handleClick}
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Link
              as={ReactLink}
              fontSize="0.8rem"
              position="absolute"
              right="0"
              to="/login/forgot"
              color="teal.500"
              bottom="110"
            >
              Forgot Password?
            </Link>
            <Flex marginTop="15px" gap="5px" alignItems="center">
              <Button
                isLoading={loading}
                flexGrow="1"
                type="submit"
                colorScheme="pink"
              >
                Sign in
              </Button>
              <GoogleOAuthProvider
                clientId={`${process.env.REACT_APP_CLIENTID}`}
              >
                <SignInGoogle loading={loading} setLoading={setLoading} />
              </GoogleOAuthProvider>
            </Flex>

            <Flex
              marginTop="-10px"
              alignItems="center"
              gap="5px"
              flexDirection="column"
            >
              <Text fontSize="0.9rem">
                Don't have an account?{" "}
                <Link as={ReactLink} to="/register" color="teal.500">
                  Sign up
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Form>
      </Box>
    </LoginAndSignupPage>
  );
}
