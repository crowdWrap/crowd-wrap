import {
  Flex,
  Heading,
  Stack,
  FormControl,
  FormLabel,
  Switch,
  Input,
  ButtonGroup,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
import { useAuth } from "../../hooks/authContext";
import { useState } from "react";

export default function PaymentPortion({
  user,
  paymentToggle,
  setPaymentToggle,
  paypalEmail,
  setPaypalEmail,
}: any) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    (async () => {
      setLoading(true);
      const response: Response = await fetch("/payment/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentType: `paypal:${paypalEmail}`,
        }),
      });

      const receivedData = await response.json();
      setUser(receivedData.user);
      toast({
        title: "Payment type set!",
        status: "success",
        duration: 4000,
      });
      setLoading(false);
    })();
  };

  return (
    <Flex justifyContent="space-evenly">
      <Flex flexDir="column" alignItems="flex-start">
        <Heading size="md">Payment</Heading>
        <Heading size="xs" color="gray.600">
          Your preffered settings, change at any time
        </Heading>
      </Flex>
      <Stack
        shadow="md"
        borderRadius="15px"
        spacing={8}
        direction="column"
        paddingLeft="40px"
        paddingRight="40px"
        paddingTop="20px"
        paddingBottom="20px"
        height="4xs"
        width="3xl"
        borderWidth="0.5px"
      >
        <Form onSubmit={handleSubmit}>
          <Flex
            flexDir="column"
            justifyContent="space-around"
            gap="25px"
            alignItems="center"
          >
            <Flex width="100%" gap="35px" flexDir="column">
              <FormControl display="flex" alignItems="center">
                <FormLabel fontSize="0.9rem" htmlFor="email-alerts" mb="0">
                  Payment
                </FormLabel>
                <Switch
                  isRequired
                  isChecked={paymentToggle}
                  onChange={(e) => setPaymentToggle(e.target.checked)}
                  id="email-alerts"
                />
              </FormControl>
              <FormControl
                isDisabled={!paymentToggle}
                variant="floating"
                id="PaypalEmail"
                isRequired
              >
                <Input
                  // borderColor="white"
                  placeholder=" "
                  transition="0.25s ease-in-out"
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                />
                <FormLabel backgroundColor="pink">Paypal Email</FormLabel>
              </FormControl>
            </Flex>
            <ButtonGroup>
              <Button
                onClick={() => {
                  setPaymentToggle(user.paymentType === "none" ? false : true);
                  setPaypalEmail(user.paymentType.substring(7));
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
