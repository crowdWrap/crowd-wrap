import {
  Flex,
  Heading,
  ButtonGroup,
  Button,
  Text,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { Form } from "react-router-dom";
import { useAuth } from "../../hooks/authContext";

export default function FlexWithText({
  setLoading,
  handlePaymentUpdate,
  setActiveStep,
  setStatus,
  loading,
  headingText,
  paragraphText,
  BtnText,
  secondButton,
}: any) {
  const [email, setEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const { setUser } = useAuth();
  const [invalid, setInvalid] = useState(false);
  const toast = useToast();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (email !== confirmEmail) {
      console.log("invalid");
      setInvalid(true);
    } else {
      (async () => {
        setInvalid(false);
        setLoading(true);
        const response: Response = await fetch("/payment/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentType: `paypal:${email}`,
          }),
        });

        const receivedData = await response.json();
        setUser(receivedData.user);
        setActiveStep(0);
        toast({
          title: "Success",
          description:
            "Payment type set! You can change it in settings at any time",
          status: "success",
          duration: 4000,
        });
      })();
    }
  };

  return (
    <Flex
      flexDir="column"
      height="100%"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Flex flexDir="column" align="center" gap="25px">
        <Heading>{headingText}</Heading>
        <Text maxW={"85%"} textAlign="center">
          {paragraphText}
        </Text>
      </Flex>
      <ButtonGroup>
        {secondButton && (
          <Button
            onClick={() => {
              setLoading(true);
              handlePaymentUpdate("none");
              setActiveStep(0);
            }}
            isLoading={loading}
          >
            No Payment
          </Button>
        )}
        {!secondButton && (
          <Form
            style={{ marginTop: "-25px" }}
            onSubmit={(e) => handleSubmit(e)}
          >
            <Flex flexDir="column" height="100%" gap="45px">
              <Flex flexDir={"column"} gap="15px">
                <FormControl
                  isInvalid={invalid}
                  variant="floating"
                  id="email"
                  isRequired
                >
                  <Input
                    placeholder=" "
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FormLabel bg="white">Email</FormLabel>
                </FormControl>
                <FormControl
                  isInvalid={invalid}
                  variant="floating"
                  id="email"
                  isRequired
                >
                  <Input
                    placeholder=" "
                    type="email"
                    onChange={(e) => setConfirmEmail(e.target.value)}
                  />
                  <FormLabel bg="white">Confirm Email</FormLabel>
                </FormControl>
              </Flex>
              <Button
                type="submit"
                //   onClick={() => {
                //     setStatus("loading");
                //   }}
                colorScheme="linkedin"
                isLoading={loading}
              >
                {BtnText}
              </Button>
            </Flex>
          </Form>
        )}
        {secondButton && (
          <Button
            onClick={() => {
              setStatus("ongoing");
            }}
            colorScheme="linkedin"
            isLoading={loading}
          >
            {BtnText}
          </Button>
        )}
      </ButtonGroup>
    </Flex>
  );
}
