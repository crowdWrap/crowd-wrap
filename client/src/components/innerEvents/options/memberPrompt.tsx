import { Flex, AvatarGroup, IconButton, Icon, useDisclosure } from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";
import FriendAvatar from "../friendAvatar";
import AddFriendToEvent from "../../events/addFriend";
import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/authContext";


async function fetchData() {
    try {
      const response = await fetch(`/friends`, {
        method: "GET",
      });
      const result = await response.json();
  
      return result;
    } catch (error: any) {
      throw new Error(error);
    }
  }

export default function MemberPrompt(){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [accounts, setAccounts] = useState<any>([]);
    const [inviteLoading, setInviteLoading] = useState<any>(null);
    const { refreshEvent, setRefreshEvent } = useAuth();
    const { currentEvent } = useAuth();

  useEffect(() => {
    (async () => {
      setAccounts(await fetchData());
      setRefreshEvent(false);
    })();
  }, [refreshEvent, setRefreshEvent]);

    const colors = [
        "pink",
        "blueviolet",
        "orange",
        "blue",
        "yellow",
        "red",
        "purple",
        "green",
        "black",
        "cyan",
      ];

    return(
        <>
        <Flex marginTop={'40px'} marginBottom={'25px'} padding="10px" width="100%" overflowY="scroll">
            <AvatarGroup
                max={11}
                flexDir={"column-reverse"}
                alignItems="center"
                width="100%"
            >
                {currentEvent.participants &&
                    currentEvent.participants.map((val: any, index: number) => (
                        <>
                            <FriendAvatar
                                events={currentEvent}
                                color={colors[index]}
                                item={val} />
                        </>
                    ))}
                   
                {currentEvent.participants && currentEvent.participants.length < 10 && (
                    <IconButton
                        marginTop={"10px"}
                        aria-label="add"
                        onClick={onOpen}
                        width={'100%'}
                        padding={'15px'}
                        icon={<Icon as={BiPlus} />} />
                )}
            </AvatarGroup>
        </Flex>
          {accounts && currentEvent && (
              <AddFriendToEvent
              isOpen2={isOpen}
              e={currentEvent}
              onClose2={onClose}
              accounts={accounts}
              setInviteLoading={setInviteLoading}
              inviteLoading={inviteLoading} />
          )}
        </>
    )
}