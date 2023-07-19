import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Box,
  Text,
  Flex,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import ButtonWrapper from "./paypalPay";
import { useState } from "react";
import AmountPrompt from "./amountPrompt";

export default function PayPrompt({ isOpen, onClose, email, events }: any) {
  const [status, setStatus] = useState<any>("amount");
  const [amount, setAmount] = useState(0);
  const toast = useToast();
  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setStatus("amount");
        setAmount(0);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pay </ModalHeader>
        <Box
          style={{ maxWidth: "750px", minHeight: "200px" }}
          alignItems="center"
          justifyContent="center"
          padding="15px"
        >
          {status === "amount" && (
            <Flex
              justifyContent="space-between"
              height="100px"
              alignItems={"center"}
              flexDir="column"
              padding="5px"
            >
              <Flex
                borderRadius="full"
                width="50px"
                height="50px"
                justifyContent="center"
                alignItems="center"
                backgroundColor="blue.500"
                padding="25px"
                marginBottom="25px"
              >
                <Text userSelect="none" color="white" fontWeight="bold">
                  <Tooltip label="Goal">{events.moneyGoal}</Tooltip>
                </Text>
              </Flex>
              <AmountPrompt events={events} setAmount={setAmount} />
            </Flex>
          )}
          {!status && (
            <ButtonWrapper
              currency="USD"
              showSpinner={false}
              amount={amount}
              email={email}
              onClose={onClose}
              events={events}
              setStatus={setStatus}
            />
          )}
        </Box>

        <ModalFooter justifyContent="center">
          <Button
            mr={3}
            onClick={() => {
              onClose();
              setStatus("amount");
            }}
          >
            Close
          </Button>
          {status === "amount" && (
            <Button
              colorScheme="blue"
              onClick={() => {
                if (amount !== 0) {
                  setStatus(null);
                } else {
                  toast({
                    title: "Failed.",
                    description: `Use a value other than 0.`,
                    status: "error",
                    duration: 4000,
                  });
                }
              }}
            >
              Next
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
