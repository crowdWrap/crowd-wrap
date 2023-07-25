import {
  ButtonGroup,
  Flex,
  Icon,
  IconButton,
  MenuItem,
  MenuList,
  useClipboard,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  AiOutlineSetting,
  AiFillMoneyCollect,
  AiOutlineForm,
} from "react-icons/ai";
import { BiGroup, BiShare } from "react-icons/bi";
import PayPrompt from "./payPrompt";
import { useAuth } from "../../hooks/authContext";
import Recommendation from "./recommendationPrompt";
import { GiSettingsKnobs } from "react-icons/gi";

export default function InnerOptions({ events }: any) {
  const toast = useToast();
  const [ownerPaymentType, setOwnerPaymentType] = useState("none");
  const [loading, setLoading] = useState(false);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: onOpen2,
    isOpen: isOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const { user, currentEvent } = useAuth();
  const { onCopy } = useClipboard(`https://crowdwrap.works/events/invite/${currentEvent.inviteLink}`);

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
              <MenuList>
            <MenuItem icon={<Icon boxSize={4} as={BiGroup} />} >
              Members
            </MenuItem>
            <MenuItem  onClick={onOpen2} icon={<Icon boxSize={4} as={AiOutlineForm} />}>
              Gift Recommendations
            </MenuItem>
            <MenuItem icon={<Icon boxSize={4} as={GiSettingsKnobs} />}>
              Event Settings
            </MenuItem>
            <MenuItem onClick={() => {
              onCopy();
              toast({
                title: "Invite link copied to clipboard.",
                status: "success",
                duration: 2000,
              });
            }} icon={<Icon boxSize={4} as={BiShare} />}>
              Share
            </MenuItem>
          </MenuList>
      <ButtonGroup>
        <Flex gap="25px" flexDir="column" >
          {!loading &&
            ownerPaymentType !== "none" &&
            user.id !== events.ownerId && (
              <IconButton
                // pay with venmo
                boxSize="100px"
                fontSize={"50px"}
                icon={<Icon boxSize={4} as={AiFillMoneyCollect} />}
                aria-label="setting"
                onClick={onOpen}
              />
            )}
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
