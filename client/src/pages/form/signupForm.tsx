import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpGoogle from "../../api/googleSignup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Link as ReactLink } from "react-router-dom";

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Link,
  Flex,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  useToast,
  InputRightAddon,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import LoginAndSignupPage from "../../components/loginAndSignup/LoginAndSignupPage";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUser,
} from "react-icons/ai";

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
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
    if (username.length < 3 || username.length > 15) {
      setUsernameError("Username must be between 3 and 15 characters");
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

    if (usernameError || passwordError || emailError) {
      toast({
        title: "Registration failed.",
        description: "Please fix the errors before submitting.",
        status: "error",
        duration: 4000,
      });
      return;
    }

    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  return (
    <LoginAndSignupPage
      handleSubmit={handleSubmit}
      headingText={"Create an account"}
      regText={"Gifting, but make it social"}
    >
      <FormControl
        isInvalid={usernameError === "" ? false : true}
        variant="floating"
        id="username"
        isRequired
      >
        <InputGroup>
          <Input
            placeholder=" "
            minLength={3}
            maxLength={15}
            onChange={handleUsernameChange}
            onBlur={() => {
              setUsernameTouched(true);
              validateUsername(registerUsername);
            }}
          />
          <FormLabel bg="white">Username</FormLabel>
          <InputRightAddon userSelect="none">
            <Icon as={AiOutlineUser} />
          </InputRightAddon>
        </InputGroup>

        {usernameTouched && (
          <>
            <FormErrorMessage position="absolute">
              {usernameError}
            </FormErrorMessage>
          </>
        )}
      </FormControl>
      <FormControl
        isInvalid={emailError === "" ? false : true}
        variant="floating"
        id="email"
        isRequired
      >
        <InputGroup>
          <Input
            placeholder=" "
            type="email"
            onBlur={() => {
              setEmailTouched(true);
              validateEmail(registerEmail);
            }}
            onChange={handleEmailChange}
          />
          <FormLabel bg="white">Email</FormLabel>
          <InputRightAddon userSelect="none">@</InputRightAddon>
        </InputGroup>
        {emailTouched && (
          <>
            <FormErrorMessage position="absolute">
              {emailError}
            </FormErrorMessage>
          </>
        )}
      </FormControl>
      <FormControl
        isInvalid={passwordError === "" ? false : true}
        variant="floating"
        id="password"
        isRequired
      >
        <InputGroup>
          <Input
            minLength={8}
            maxLength={15}
            type={show ? "text" : "password"}
            placeholder=" "
            onChange={handlePasswordChange}
            onBlur={() => {
              setPasswordTouched(true);
              validatePassword(registerPass);
            }}
          />
          <FormLabel bg="white">Password</FormLabel>
          <InputRightElement>
            <IconButton
              mr="10px"
              aria-label="Show"
              onClick={handleClick}
              variant="unstyled"
              _hover={{ color: "pink.500" }}
              boxSize="6"
              as={show ? AiOutlineEye : AiOutlineEyeInvisible}
            />
          </InputRightElement>
        </InputGroup>
        {passwordTouched && (
          <FormErrorMessage position="absolute">
            {passwordError}
          </FormErrorMessage>
        )}
      </FormControl>

      <Flex marginTop="15px" gap="5px" alignItems="center">
        <Button
          isLoading={loading}
          flexGrow="1"
          type="submit"
          colorScheme="pink"
        >
          Sign up
        </Button>
        <GoogleOAuthProvider clientId={`${process.env.REACT_APP_CLIENTID}`}>
          <SignUpGoogle loading={loading} setLoading={setLoading} />
        </GoogleOAuthProvider>
      </Flex>

      <Flex
        marginTop="-10px"
        alignItems="center"
        gap="5px"
        flexDirection="column"
      >
        <Text fontSize="0.9rem">
          Already have an account?{" "}
          <Link as={ReactLink} to="/login" color="teal.500">
            Sign in
          </Link>
        </Text>
      </Flex>
    </LoginAndSignupPage>
  );
}
