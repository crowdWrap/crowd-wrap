import {
  ButtonGroup,
  Flex,
  IconButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  AiOutlineSetting,
  AiFillMoneyCollect,
  AiOutlineForm,
} from "react-icons/ai";
import { BiShare } from "react-icons/bi";
import PayPrompt from "./payPrompt";
import { useAuth } from "../../hooks/authContext";
import Recommendation from "./recommendationPrompt";

export default function InnerOptions({ onCopy, events }: any) {
  const toast = useToast();
  const [ownerPaymentType, setOwnerPaymentType] = useState("none");
  const [loading, setLoading] = useState(false);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: onOpen2,
    isOpen: isOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (events.ownerId) {
        const response = await fetch(
          `/payment/update?userId=${events.ownerId}`,
          {
            method: "GET",
          }
        );
        const receivedData = await response.json();
        setOwnerPaymentType(receivedData.paymentType);
        setLoading(false);
      }
    })();
  }, [events.ownerId]);
  return (
    <>
      <ButtonGroup>
        <Flex gap="25px" flexDir="column">
          {!loading &&
            ownerPaymentType !== "none" &&
            user.id !== events.ownerId && (
              <IconButton
                // pay with venmo
                boxSize="100px"
                fontSize={"50px"}
                icon={<AiFillMoneyCollect />}
                aria-label="setting"
                onClick={onOpen}
              />
            )}
          <IconButton
            aria-label="recommendations"
            boxSize="100px"
            fontSize={"50px"}
            onClick={onOpen2}
            icon={<AiOutlineForm />}
          />
          <IconButton
            // will provide the option to change the name of the event, budget, etc
            boxSize="100px"
            fontSize={"50px"}
            icon={<AiOutlineSetting />}
            aria-label="setting"
          />

          <IconButton
            aria-label="Share"
            boxSize="100px"
            fontSize={"50px"}
            onClick={() => {
              onCopy();
              toast({
                title: "Invite link copied to clipboard.",
                status: "success",
                duration: 2000,
              });
            }}
            icon={<BiShare aria-label="ShareIcon" />}
          />
        </Flex>
      </ButtonGroup>
      <PayPrompt
        isOpen={isOpen}
        onClose={onClose}
        email={ownerPaymentType.substring(7)}
        events={events}
      />
      <Recommendation isOpen={isOpen2} onClose={onClose2} />
    </>
  );
}
