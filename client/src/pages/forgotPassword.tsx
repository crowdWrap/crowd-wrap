import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Link,
  PinInput,
  PinInputField,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
  useToast,
} from "@chakra-ui/react";
import { Link as ReactLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginAndSignupPage from "../components/loginAndSignup/LoginAndSignupPage";
import { AiOutlineUser } from "react-icons/ai";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [codePage, setCodePage] = useState(false);
  const [enterPass, setEnterPass] = useState(false);
  const [complete, setComplete] = useState(false);
  const [currentText, setCurrentText] = useState(
    "No worries, we'll send you reset instructions"
  );
  const [invalid, setInvalid] = useState(false);
  const [usernameEmail, setUsernameEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false);
  const [showNew, setShowNew] = useState(false);

  const toast = useToast();

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
    setPassword(e.target.value);
    if (passwordTouched) validatePassword(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (enterPass) {
      const data = JSON.stringify({
        usernameEmail,
        password,
      });
      const response = await fetch("/login/forgot/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      if (response.ok) {
        setActiveStep(3);
        toast({
          title: "Password Changed!",
          status: "success",
          duration: 4000,
        });
        navigate("/login");
      } else {
        toast({
          title: "Error.",
          status: "error",
          duration: 4000,
        });
      }
    } else if (codePage && complete) {
      const data = JSON.stringify({
        usernameEmail,
        token,
      });
      const response = await fetch("/login/forgot/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      const receivedData = await response.json();

      if (receivedData.valid) {
        setInvalid(false);
        setEnterPass(true);
        setCurrentText("Enter your new password");
        setActiveStep(2);
      } else {
        setInvalid(true);
      }
    } else {
      const data = JSON.stringify({
        usernameEmail,
      });
      const response = await fetch("/login/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      if (response.ok) {
        setCodePage(true);
        setCurrentText(
          "Enter the code sent to the associated email. It will expire after 5 minutes"
        );
        setActiveStep(1);
      }
    }
  };

  const steps = [{ title: "First" }, { title: "Second" }, { title: "Third" }];

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  return (
    <>
      <LoginAndSignupPage
        handleSubmit={handleSubmit}
        headingText={"Forgot Password?"}
        regText={currentText}
      >
        <Flex alignItems="center" gap="30px" flexDir="column">
          {!codePage ? (
            <FormControl variant="floating" id="usernameEmail" isRequired>
              <InputGroup>
                <Input
                  onChange={(e) => setUsernameEmail(e.target.value)}
                  value={usernameEmail}
                  placeholder=" "
                />
                <FormLabel bg="white">Username or Email</FormLabel>
                <InputRightAddon userSelect="none">
                  <Icon as={AiOutlineUser} />@
                </InputRightAddon>
              </InputGroup>
            </FormControl>
          ) : !enterPass ? (
            <HStack width="100%">
              <PinInput
                size={"lg"}
                autoFocus
                onComplete={(e) => {
                  setToken(e);
                  setComplete(true);
                }}
                type="number"
                isInvalid={invalid}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          ) : (
            <>
              <FormControl
                isInvalid={passwordError === "" ? false : true}
                variant="floating"
                isRequired
                id="password"
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
                      validatePassword(password);
                    }}
                    value={password}
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
              {"<- "} Back to sign in
            </Link>
          </Flex>
        </Flex>
      </LoginAndSignupPage>
      <Flex
        justifyContent="center"
        height="100vh"
        alignItems="flex-end"
        width={"35%"}
        paddingBottom="25px"
      >
        <Stepper colorScheme="pink" size="sm" width="80%" index={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </Flex>
    </>
  );
}
