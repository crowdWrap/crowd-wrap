import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import backgroundImage from ".././assets/image_group/blue-pink-better-theme.png";
import {
  Box,
  Button,
  Flex,
  Heading,
  Skeleton,
  Text,
  useToast,
} from "@chakra-ui/react";
import SingularEvent from "../components/events/singularEvent";
import { socket } from "../api/socket";

export default function EventInvite() {
  const navigate = useNavigate();
  const { link } = useParams();
  const [inviteStatus, setInviteStatus] = useState("");
  const [buttonStatus, setButtonStatus] = useState("");
  const [event, setEvent] = useState<any>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response: Response = await fetch(`/events/invite/${link}`, {
          method: "GET",
        });

        const responded: any = await response.json();

        if (responded.invalidInvite) {
          setInviteStatus("Invalid Invite!");
          setButtonStatus("😞");
        } else {
          if (responded.notLoggedIn) {
            setInviteStatus("Please log in!");
            setButtonStatus("😞");
          } else {
            if (responded.inEvent) {
              setInviteStatus(
                "You have been invited to an event you're already in!"
              );
              setButtonStatus("Go to event");
              setEvent(responded.event);
            } else {
              setInviteStatus("You have been invited to join!");
              setButtonStatus("Join");
              setEvent(responded.event);
            }
          }
        }
        setLoading(false);
      } catch (e) {
        console.log("invite error:" + e);
      }
    })();
    socket.on("eventUpdate", (data) => {
      if (data.message !== "") {
        toast({
          title: "Event Notification.",
          description: `${data.message}.`,
          status: data.stats as
            | "info"
            | "warning"
            | "success"
            | "error"
            | "loading",
          duration: 4000,
        });
      }
    });

    return () => {
      socket.off("eventUpdate");
    };
  }, [link, toast]);

  const handleButton = async () => {
    if (event) {
      if (buttonStatus === "Join") {
        await fetch(`/events/invite/${link}`, {
          method: "POST",
        });
        navigate(`/events/${event.title}-${event.id}`);
      } else if (buttonStatus === "Go to event") {
        navigate(`/events/${event.title}-${event.id}`);
      }
    }
  };

  return (
    <>
      {!loading && (
        <Flex
          justifyContent="center"
          height="100vh"
          width="100vw"
          position="absolute"
          top="0px"
          backgroundImage={backgroundImage}
          filter="hue-rotate(120deg)"
          alignItems="center"
        >
          <Flex
            padding="40px"
            borderRadius="2xl"
            maxW="xl"
            bg="white"
            filter="hue-rotate(-120deg)"
            flexDir="column"
            gap="35px"
            alignItems="center"
          >
            <Heading size="lg" textAlign={"center"}>
              {inviteStatus}
            </Heading>
            {event && (
              <SingularEvent
                e={event}
                inviteLink={`http://localhost:3000/events/invite/${link}`}
                events={event}
              />
            )}
            <Button onClick={handleButton} size="lg" colorScheme="pink">
              {buttonStatus}
            </Button>
          </Flex>
        </Flex>
      )}
    </>
  );
}
