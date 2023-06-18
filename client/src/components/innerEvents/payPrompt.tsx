import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import ButtonWrapper from "./paypalPay";
import { useEffect, useState } from "react";

export default function PayPrompt({ isOpen, onClose, email }: any) {
  const [status, setStatus] = useState<any>(null);
  useEffect(() => {
    return () => {
      setStatus(null);
    };
  }, []);
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pay the host</ModalHeader>
        <ModalCloseButton />
        <Box
          style={{ maxWidth: "750px", minHeight: "200px" }}
          alignItems="center"
          justifyContent="center"
          padding="15px"
        >
          {!status && (
            <ButtonWrapper
              currency="USD"
              showSpinner={false}
              amount={"2"}
              email={email}
              setStatus={setStatus}
            />
          )}
          {status && <Text>Congrats you have paid!</Text>}
        </Box>

        <ModalFooter justifyContent="center">
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
