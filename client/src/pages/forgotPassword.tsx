import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  Link,
  PinInput,
  PinInputField,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  useSteps,
} from "@chakra-ui/react";
import { Form, Link as ReactLink } from "react-router-dom";
import backgroundImage from ".././assets/image_group/blue-pink-better-theme.png";
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
  const handleSubmit = () => {
    if (enterPass) {
      // make surre the pass is valid
      // then redirect back to login
      // with a toast
    } else if (codePage && complete) {
      // if(checkifitsvalid)
      setEnterPass(true);
      setCurrentText("Enter your new password");
      setActiveStep(2);
    } else {
      setCodePage(true);
      setCurrentText("Enter the code sent to the associated email");
      setActiveStep(1);
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
                <Input placeholder=" " />
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
                onComplete={() => setComplete(true)}
                type="number"
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
