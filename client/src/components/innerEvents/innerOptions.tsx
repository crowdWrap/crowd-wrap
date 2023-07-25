import {
  Icon,
  MenuItem,
  MenuList,
  useClipboard,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
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
            {!loading &&
            ownerPaymentType !== "none" &&
            user.id !== events.ownerId && (
            <MenuItem onClick={onOpen} icon={<Icon boxSize={4} as={AiFillMoneyCollect} />}>
              Pay with Paypal
            </MenuItem>
            )}
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
