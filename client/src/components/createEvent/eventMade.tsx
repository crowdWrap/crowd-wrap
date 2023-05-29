import { useEffect, useState } from "react";
import {
  useClipboard,
  Button,
  Flex,
  IconButton,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BiShare } from "react-icons/bi";

export default function EventMade({
  title,
  description,
  moneyGoal,
  date,
  time,
  img,
  loading,
  setLoading,
  onClose,
}: // setTheInviteLink,
any) {
  const [inviteLink, setInviteLink] = useState<string>("Loading...");
  const { onCopy } = useClipboard(inviteLink);
  const [theId, setTheId] = useState<any>();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const response: Response = await fetch("/events/retrieve", {
        method: "GET",
      });

      const receivedData = await response.json();
      setInviteLink(
        `http://localhost:3000/events/invite/${
          receivedData[receivedData.length - 1].inviteLink
        }`
      );
      setTheId(receivedData[receivedData.length - 1].id);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <Flex
      height="400px"
      flexDir="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <div>
        <p>add any of your friends?</p>
      </div>
      {/* utilize friendsliat to simply display them here and have a plus to add them */}
      <ButtonGroup>
        <Button
          onClick={() => {
            navigate(`/events/${title}-${theId}`);
            onClose();
          }}
        >
          Go to Event
        </Button>
        <IconButton
          aria-label="Share"
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
      </ButtonGroup>
    </Flex>
  );
}
