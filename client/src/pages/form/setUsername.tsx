import { Form, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/authContext";
import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import ValidityCheck from "../../components/setUsername/validityCheck";
import LoginAndSignupPage from "../../components/loginAndSignup/LoginAndSignupPage";
import { debounce } from "lodash";

export default function SetUsername() {
  const { authed, user, setUser } = useAuth();
  const [usernameMsg, setUsernameMsg] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!authed) {
      navigate("/login");
    } else if (authed && user.usernameSet) {
      navigate("/profile");
    }
  }, [authed, navigate, user.usernameSet]);

  
  const validateUsername = (username: string) => {
    if (username.length < 3 || username.length > 15) {
      setUsernameError("Username must be between 3 and 15 chars");
    } else if (username.includes(" ")) {
      setUsernameError("Username must not contain spaces");
    } else {
      setUsernameError("");
    }
  };



  const handleUsernamecheck = async (e: any) => {
    if (e.target.value.length >= 3 && e.target.value.length < 15) {
      const response = await fetch(
        `/profile/setUsername?username=${e.target.value}`,
        {
          method: "GET",
        }
      );

      const receiveData = await response.json();
      setUsernameMsg(receiveData.isValid);
      setLoading(false);

    } else {
      setUsernameMsg(false);
      setLoading(false);
    }
  };

  const debouncedHandleUsernamecheck = debounce(handleUsernamecheck, 550);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (usernameTouched) validateUsername(e.target.value);
    setLoading(true);
    debouncedHandleUsernamecheck(e);
  };


  async function handleSubmit() {
    if (usernameError) {
      toast({
        title: "Set username failed.",
        description: "Please fix the errors before submitting.",
        status: "error",
        duration: 4000,
      });
      return;
    } else if (!usernameMsg) {
      toast({
        title: "This username is taken!",
        status: "error",
        duration: 4000,
      });
      return;
    }

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
    }
  }

  return (
    <LoginAndSignupPage
    handleSubmit={handleSubmit}
    headingText={"Username selection"}
    regText={"Please set your username"}
    height='93vh'
  >
        <Flex
          flexDir="column"
          justifyContent="space-around"
          gap="45px"
          // alignItems="center"
        >
          {/* <Flex justifyContent="center">
            <FileUpload thePicture={user.picture} />
          </Flex> */}
          <Form onSubmit={handleSubmit}>
            <Flex
              flexDir="column"
              justifyContent="space-around"
              gap="45px"
              alignItems="center"
            >
              <FormControl
                variant="floating"
                id="username"
                isRequired
                isInvalid={usernameError === "" ? false : true}
              >
                <Input
                  // borderColor="white"
                  placeholder=" "
                  transition="0.25s ease-in-out"
                  minLength={3}
                  maxLength={15}
                  onChange={(e) => {
                    handleUsernameChange(e);
                    // handleUsernamecheck(e);
                  }}
                  onBlur={() => {
                    setUsernameTouched(true);
                    validateUsername(username);
                  }}
                />
                <FormLabel backgroundColor="pink">Set Username</FormLabel>
                <ValidityCheck loading={loading} usernameMsg={usernameMsg} />
                {usernameTouched && (
                  <>
                    <FormErrorMessage
                      position="absolute"
                      width="100%"
                      textAlign="center"
                      // fontSize="xs"
                      color="red.500"
                      marginBottom="15px"
                    >
                      {usernameError}
                    </FormErrorMessage>
                  </>
                )}
              </FormControl>
              <Button width={'100%'}  type="submit" colorScheme="pink">
                Continue
              </Button>
            </Flex>
          </Form>
        </Flex>
      </LoginAndSignupPage>
  );
}
