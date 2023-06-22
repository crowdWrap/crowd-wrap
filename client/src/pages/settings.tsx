import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
import FileUpload from "../components/setUsername/fileUpload";
import ValidityCheck from "../components/setUsername/validityCheck";
import { useAuth } from "../hooks/authContext";
import { useEffect, useState } from "react";

export default function Settings() {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState<any>();
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [paymentToggle, setPaymentToggle] = useState<any>();
  useEffect(() => {
    if (!loading) {
      setUsername(user.username);
      setPaymentToggle(user.paymentType === "none" ? false : true);
    }
  }, [loading, user.username]);

  return (
    <>
      {!loading && (
        <Flex
          padding="100px 120px"
          flexDir="column"
          justifyContent="space-evenly"
          // height="90vh"
          overflowY="scroll"
        >
          <Flex justifyContent="space-evenly">
            <Flex flexDir="column" alignItems="flex-start">
              <Heading size="md">Account Settings</Heading>
              <Heading size="xs" color="gray.600">
                Your account details, change at any time
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
              height="xl"
              width="3xl"
              borderWidth="0.5px"
            >
              <Flex justifyContent="center">
                <FileUpload thePicture={user.picture} />
              </Flex>
              <Form>
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
                      maxLength={15}
                      value={user.email}
                      isDisabled
                    />
                    <FormLabel backgroundColor="pink">Email</FormLabel>
                  </FormControl>
                  <FormControl variant="floating" id="username" isRequired>
                    <Input
                      // borderColor="white"
                      placeholder=" "
                      transition="0.25s ease-in-out"
                      minLength={3}
                      maxLength={15}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <FormLabel backgroundColor="pink">Username</FormLabel>
                  </FormControl>
                  <FormControl variant="floating" id="oldPassword" isRequired>
                    <Input
                      // borderColor="white"
                      placeholder=" "
                      transition="0.25s ease-in-out"
                      minLength={3}
                      maxLength={15}
                    />
                    <FormLabel backgroundColor="pink">Old Password</FormLabel>
                  </FormControl>
                  <FormControl variant="floating" id="newPassword" isRequired>
                    <Input
                      // borderColor="white"
                      placeholder=" "
                      transition="0.25s ease-in-out"
                      minLength={3}
                      maxLength={15}
                    />
                    <FormLabel backgroundColor="pink">New Password</FormLabel>
                  </FormControl>
                  <ButtonGroup>
                    <Button type="reset">Cancel</Button>
                    <Button type="submit" bg="pink">
                      Save
                    </Button>
                  </ButtonGroup>
                </Flex>
              </Form>
            </Stack>
          </Flex>
          <Divider marginTop="70px" marginBottom="70px" />
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
              <Form>
                <Flex
                  flexDir="column"
                  justifyContent="space-around"
                  gap="25px"
                  alignItems="center"
                >
                  <Flex width="100%" gap="35px" flexDir="column">
                    <FormControl display="flex" alignItems="center">
                      <FormLabel
                        fontSize="0.9rem"
                        htmlFor="email-alerts"
                        mb="0"
                      >
                        Payment
                      </FormLabel>
                      <Switch
                        isRequired
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
                        minLength={3}
                        maxLength={15}
                      />
                      <FormLabel backgroundColor="pink">Paypal Email</FormLabel>
                    </FormControl>
                  </Flex>
                  <ButtonGroup>
                    <Button type="reset">Cancel</Button>
                    <Button type="submit" bg="pink">
                      Save
                    </Button>
                  </ButtonGroup>
                </Flex>
              </Form>
            </Stack>
          </Flex>
        </Flex>
      )}
    </>
  );
}
