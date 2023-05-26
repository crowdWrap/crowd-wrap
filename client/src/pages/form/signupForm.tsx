import React from "react";
import styles from "./form.module.css";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import SignUpGoogle from "../../api/googleSignup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Header from "../../components/header/Header";
import { Link as ReactLink } from "react-router-dom";
import backgroundImage from "../.././assets/image_group/blue-pink-better-theme.png";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
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
} from "@chakra-ui/react";

export default function SignupForm() {
  const [registerUsername, setRegisterUsername] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPass, setRegisterPassword] = useState<string>("");

  const [usernameError, setUsernameError] = useState<string>("");
  const [usernameTouched, setUsernameTouched] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<string>("");
  const [emailTouched, setEmailTouched] = useState<boolean>(false);

  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false);

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  const validateUsername = (username: string) => {
    if (username.length < 3 || username.length > 20) {
      setUsernameError("Username must be between 3 and 20 characters");
    } else if (username.includes(" ")) {
      setUsernameError("Username must not contain spaces");
    } else {
      setUsernameError("");
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8 || password.length > 20) {
      setPasswordError("Password must be between 8 and 20 characters");
    } else if (password.includes(" ")) {
      setPasswordError("Password must not contain spaces");
    } else {
      setPasswordError("");
    }
  };

  const validateEmail = (email: string) => {
    if (!email.includes("@")) {
      setEmailError("Email must include an @");
    } else {
      setEmailError("");
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterUsername(e.target.value);
    if (usernameTouched) validateUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterPassword(e.target.value);
    if (passwordTouched) validatePassword(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterEmail(e.target.value);
    if (emailTouched) validateEmail(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = JSON.stringify({
      username: registerUsername,
      email: registerEmail,
      password: registerPass,
    });

    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then(async (response) => {
        const receivedData = await response.json();
        if (response.ok) {
          toast({
            title: "Registration Succesful.",
            description: `${receivedData.message}`,
            status: "success",
            duration: 4000,
          });
          navigate("/login");
        } else {
          toast({
            title: "Registration failed.",
            description: `${receivedData.message}.`,
            status: "error",
            duration: 4000,
          });
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <Flex
      borderColor={"red"}
      height="100vh"
      backgroundPosition="40%"
      position="absolute"
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
        <Heading fontWeight="900" marginBottom="50px">
          Signup
        </Heading>
        <Form onSubmit={handleSubmit}>
          <Flex gap="30px" flexDir="column">
            <FormControl
              isInvalid={usernameError === "" ? false : true}
              variant="floating"
              id="username"
              isRequired
            >
              <Input
                placeholder=" "
                onChange={handleUsernameChange}
                onBlur={() => {
                  setUsernameTouched(true);
                  validateUsername(registerUsername);
                }}
              />
              <FormLabel>Username</FormLabel>

              {usernameTouched && (
                <>
                  <FormErrorMessage>{usernameError}</FormErrorMessage>
                </>
              )}
            </FormControl>
            <FormControl
              isInvalid={emailError === "" ? false : true}
              variant="floating"
              id="email"
              isRequired
            >
              <Input
                placeholder=" "
                type="email"
                onBlur={() => {
                  setEmailTouched(true);
                  validateEmail(registerEmail);
                }}
                onChange={handleEmailChange}
              />
              <FormLabel>Email</FormLabel>
              {emailTouched && (
                <>
                  <FormErrorMessage>{emailError}</FormErrorMessage>
                </>
              )}
            </FormControl>
            <FormControl
              isInvalid={passwordError === "" ? false : true}
              variant="floating"
              id="password"
              isRequired
            >
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder=" "
                  onChange={handlePasswordChange}
                  onBlur={() => {
                    setPasswordTouched(true);
                    validatePassword(registerPass);
                  }}
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
              {passwordTouched && (
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              )}
            </FormControl>

            <Flex flexDir="row" gap="8px">
              <Button flexGrow="1" type="submit" colorScheme="pink">
                Sign up
              </Button>
              <GoogleOAuthProvider
                clientId={`${process.env.REACT_APP_CLIENTID}`}
              >
                <SignUpGoogle />
              </GoogleOAuthProvider>
            </Flex>

            <Flex alignItems="center" gap="5px" flexDirection="column">
              <Text>
                Already have an account?{" "}
                <Link as={ReactLink} to="/login" color="teal.500">
                  Sign in
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
