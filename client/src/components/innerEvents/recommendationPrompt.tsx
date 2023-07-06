import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import IndividualReccomendation from "./individualRecommendation";

export default function Recommendation({ isOpen, onClose }: any) {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Gift Ideas</ModalHeader>
        <ModalBody>
          <IndividualReccomendation />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
