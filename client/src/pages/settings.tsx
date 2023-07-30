import { Divider, Flex } from "@chakra-ui/react";
import { useAuth } from "../hooks/authContext";
import { useEffect, useState } from "react";
import PasswordPortion from "../components/settings/passwordPortion";
import PaymentPortion from "../components/settings/paymentPortion";

export default function Settings() {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState<any>();
  const [paymentToggle, setPaymentToggle] = useState<any>();
  const [paypalEmail, setPaypalEmail] = useState<any>();

  useEffect(() => {
    if (!loading) {
      setUsername(user.username);
      setPaymentToggle(
        user.paymentType === "none" || user.paymentType === "" ? false : true
      );
      setPaypalEmail(user.paymentType.substring(7));
    }
  }, [loading, user.paymentType, user.username]);

  return (
    <>
      {!loading && (
        <Flex
          padding={["15px","100px 120px"]}
          flexDir="column"
          justifyContent="space-evenly"
          // height="90vh"
          overflowY="scroll"
        >
          <PasswordPortion
            user={user}
            username={username}
            setUsername={setUsername}
          />
          <Divider marginTop="70px" marginBottom="70px" />
          <PaymentPortion
            user={user}
            paymentToggle={paymentToggle}
            setPaymentToggle={setPaymentToggle}
            paypalEmail={paypalEmail}
            setPaypalEmail={setPaypalEmail}
          />
        </Flex>
      )}
    </>
  );
}
