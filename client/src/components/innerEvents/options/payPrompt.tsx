import {
  Box,
  Text,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import ButtonWrapper from "../paypalPay";
import { useState } from "react";
import AmountPrompt from "./amountPrompt";
import { useAuth } from "../../../hooks/authContext";

export default function PayPrompt({ email }: any) {
  const [amount, setAmount] = useState(0);
  const {currentEvent} = useAuth();

  return (
      <Flex flexDir={'column'} overflowY={'scroll'} justifyContent="space-around" alignItems={'center'} width={'100%'} height={'100%'}>
      <Box
      alignItems="center"
      justifyContent="center"
      padding="15px"
    >

        <Flex
          justifyContent="space-between"
          alignItems={"center"}
          flexDir="column"
          padding="5px"
        >
          <Flex
            borderRadius="full"
            justifyContent="center"
            alignItems="center"
            backgroundColor="blue.500"
            padding="25px"
            aspectRatio={"1/1"}
            marginBottom="25px"
          >
            <Text userSelect="none" color="white" fontWeight="bold">
              <Tooltip label="Goal">{currentEvent.moneyGoal}</Tooltip>
            </Text>
          </Flex>
          <AmountPrompt events={currentEvent} setAmount={setAmount} />
        </Flex>
    </Box>
    <Box justifyContent="center">
    <ButtonWrapper
      currency="USD"
      showSpinner={false}
      amount={amount}
      email={email}
      events={currentEvent}
      />
      </Box></Flex>
  );
}
