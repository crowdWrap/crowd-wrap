import {
  Flex,
  Heading,
  Stack,
  FormControl,
  Input,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  ButtonGroup,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
import FileUpload from "../setUsername/fileUpload";
import { useState } from "react";
import { useAuth } from "../../hooks/authContext";

export default function PasswordPortion({ user, username, setUsername }: any) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false);

  const [usernameError, setUsernameError] = useState<string>("");
  const [usernameTouched, setUsernameTouched] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { setUser } = useAuth();

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (passwordTouched) validatePassword(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (usernameTouched) validateUsername(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    if (usernameError || (passwordError && newPassword !== "")) {
      toast({
        title: "Save failed.",
        description: "Please fix the errors before submitting.",
        status: "error",
        duration: 4000,
      });
      return;
    }

    if (user.username !== username) {
      const data = JSON.stringify({
        username: username,
      });

      const response = await fetch("/profile/setUsername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      const receivedData = await response.json();
      if (response.ok) {
        toast({
          title: receivedData.message,
          status: "success",
          duration: 4000,
        });
        setUser(receivedData.user);
      } else {
        toast({
          title: receivedData.message,
          status: "error",
          duration: 4000,
        });
      }
    }

    if (oldPassword !== "" && newPassword !== "") {
      const data = JSON.stringify({
        oldPassword,
        newPassword,
      });

      const response = await fetch("/profile/password/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      const receivedData = await response.json();
      if (response.ok) {
        setOldPassword("");
        setNewPassword("");
        toast({
          title: receivedData.message,
          status: "success",
          duration: 4000,
        });
      } else {
        toast({
          title: receivedData.message,
          status: "error",
          duration: 4000,
        });
      }
    }
    setLoading(false);
  };

  return (
    <Flex flexDir={["column","column","column","row"]} justifyContent="space-evenly">
      <Flex  paddingTop={["20px","20px","20px", "0px"]} flexDir="column" alignItems="flex-start">
        <Heading size="md">Account Settings</Heading>
        <Heading size="xs" color="gray.600">
          Your account details, change at any time
        </Heading>
      </Flex>
      <Stack
        shadow={["none","none","none","md"]}
        borderRadius="15px"
        spacing={8}
        direction="column"
        paddingLeft={["0px","0px","0px","40px"]}
        paddingRight={["0px","0px","0px","40px"]}
        paddingTop={["40px","40px","40px", "20px"]}
        paddingBottom="20px"
        height={user.registeredWith !== "google" ? "xl" : "4xs"}
        width={["","","","3xl"]}
        borderWidth={["0","0","0", "0.5px"]}
      >
        <Flex justifyContent="center">
          <FileUpload thePicture={user.picture} />
        </Flex>
        <Form onSubmit={handleSubmit}>
          <Flex
            flexDir="column"
            justifyContent="space-around"
            gap="45px"
            alignItems="center"
          >
            <FormControl variant="floating" id="email" isRequired>
              <Input
                // borderColor="white"
                placeholder=" "
                transition="0.25s ease-in-out"
                minLength={3}
                type="email"
                maxLength={15}
                value={user.email}
                isDisabled
              />
              <FormLabel backgroundColor="pink">Email</FormLabel>
            </FormControl>
            <FormControl
              isInvalid={usernameError === "" ? false : true}
              variant="floating"
              id="username"
              isRequired
            >
              <Input
                // borderColor="white"
                placeholder=" "
                transition="0.25s ease-in-out"
                minLength={3}
                maxLength={15}
                value={username}
                onChange={(e) => handleUsernameChange(e)}
                onBlur={() => {
                  setUsernameTouched(true);
                  validateUsername(username);
                }}
              />
              <FormLabel backgroundColor="pink">Username</FormLabel>
              {usernameTouched && (
                <>
                  <FormErrorMessage position="absolute">
                    {usernameError}
                  </FormErrorMessage>
                </>
              )}
            </FormControl>
            {user.registeredWith !== "google" && (
              <>
                <FormControl variant="floating" id="oldPassword">
                  <InputGroup size="md">
                    <Input
                      // borderColor="white"
                      placeholder=" "
                      transition="0.25s ease-in-out"
                      type={showOld ? "text" : "password"}
                      onChange={(e) => setOldPassword(e.target.value)}
                      value={oldPassword}
                      minLength={8}
                      maxLength={15}
                    />
                    <FormLabel backgroundColor="pink">Old Password</FormLabel>
                    <InputRightElement width="4.5rem">
                      <Button
                        marginTop="auto"
                        marginBottom="auto"
                        variant="outline"
                        colorScheme="blue"
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowOld(!showOld)}
                      >
                        {showOld ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl
                  isInvalid={
                    passwordError === "" || newPassword === "" ? false : true
                  }
                  variant="floating"
                  id="newPassword"
                >
                  <InputGroup size="md">
                    <Input
                      // borderColor="white"
                      placeholder=" "
                      transition="0.25s ease-in-out"
                      type={showNew ? "text" : "password"}
                      onChange={(e) => handlePasswordChange(e)}
                      onBlur={() => {
                        setPasswordTouched(true);
                        validatePassword(newPassword);
                      }}
                      value={newPassword}
                      minLength={8}
                      maxLength={15}
                    />
                    <FormLabel backgroundColor="pink">New Password</FormLabel>
                    <InputRightElement width="4.5rem">
                      <Button
                        marginTop="auto"
                        marginBottom="auto"
                        variant="outline"
                        colorScheme="blue"
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShowNew(!showNew)}
                      >
                        {showNew ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {passwordTouched && (
                    <FormErrorMessage position="absolute">
                      {passwordError}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </>
            )}
            <ButtonGroup>
              <Button
                onClick={() => {
                  setUsername(user.username);
                  setOldPassword("");
                  setNewPassword("");
                }}
                type="reset"
              >
                Cancel
              </Button>
              <Button isLoading={loading} type="submit" bg="pink">
                Save
              </Button>
            </ButtonGroup>
          </Flex>
        </Form>
      </Stack>
    </Flex>
  );
}
