import { useEffect, useMemo, useRef, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";

import FriendAvatar from "./friendAvatar";
import { useAuth } from "../../hooks/authContext";
import {
  AvatarGroup,
  Box,
  Flex,
  Icon,
  IconButton,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Message from "./messege";
import { BiPlus } from "react-icons/bi";
import { socket } from "../../api/socket";
import AddFriendToEvent from "../events/addFriend";
import { AiOutlineSend } from "react-icons/ai";
import Confetti from "react-dom-confetti";

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

export default function TheEvent() {
  const { id } = useParams();
  const dashIndex: any = id?.lastIndexOf("-");
  const eventId: any = id?.substring(dashIndex + 1);
  const [events, setEvents] = useState<any>([]);
  const { refreshEvent, setRefreshEvent, setCurrentEvent } = useAuth();
  const toast = useToast();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inviteLink, setInviteLink] = useState<string>("Loading...");
  const [messages, setMessages] = useState<any>([]);
  const [refreshMessages, setRefreshMessages] = useState(false);
  const messageToSendRef = useRef<any>("");
  const messagesEndRef = useRef<any>(null);
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any>([]);
  const [refreshInner, setRefreshInner] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const navigate = useNavigate();

  const [inviteLoading, setInviteLoading] = useState<any>(null);


  const confettiConfig = {
    angle: 90,
    spread: 460,
    startVelocity: 20,
    elementCount: 200,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`/events/id?eventId=${eventId}`, {
        method: "GET",
      });

      const data = await response.json();
      if (!data.event) {
        navigate("/events");
        return;
      }


      setCurrentEvent(data.event)
      const isInside = await data.event.participants.filter(
        (participant: any) => Number(participant.userId) === Number(user.id)
      );
      if (isInside.length === 0) {
        navigate("/events");
      } else {
        setInviteLink(`https://crowdwrap.works/events/invite/${data.event.inviteLink}`);
        return data.event;
      }
    };

    (async () => {
      setLoading(true);
      setEvents(await fetchEvent());
      setAccounts(await fetchData());
      setRefreshEvent(false);
      setRefreshInner(false);
      setLoading(false);
      setInviteLoading(null);
    })();
  }, [eventId, navigate, refreshEvent, setRefreshEvent, user.id, refreshInner, setCurrentEvent]);

  useEffect(() => {
    socket.on("eventUpdate", (data) => {
      setRefreshInner(true);
      if (data.message !== "") {
        if (data.message.includes("paid")) {
          setConfetti(true);
        }
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
        setTimeout(() => {
          setConfetti(false);
        }, 3000);
      }
    });

    return () => {
      socket.off("eventUpdate");
      setConfetti(false);
    };
  }, [setRefreshInner, toast]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/events/${eventId}/messages`, {
        method: "GET",
      });
      const data = await response.json();
      return data.messages;
    };

    (async () => {
      // setLoading(true);
      setMessages(await fetchMessages());

      setRefreshMessages(false);
      // setLoading(false);
    })();
  }, [eventId, refreshMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("sendMsg", () => {
      setRefreshMessages(true);
    });

    return () => {
      socket.off("sendMsg");
    };
  }, []);

  const handleSubmit = async () => {
    
    const data = JSON.stringify({
      content: messageToSendRef.current.value,
    });
    
    const response = await fetch(`/events/${eventId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    messageToSendRef.current.value = "";
    const receivedData = await response.json();
    if (messages.length > 0) {
      setMessages([...messages, receivedData.messageWithPicture]);
    } else {
      setMessages([receivedData.messageWithPicture]);
    }
    
  };

  // const handleDate = () => {
  //   const dateObj = new Date(events.deadlineDate);
  //   const options: object = { month: "long", day: "numeric", year: "numeric" };
  //   const formattedDate = dateObj.toLocaleDateString("en-US", options);
  //   return formattedDate;
  // };


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

  const participantColors = useMemo(() => {
    const colorMap = new Map();
    events.participants?.forEach((participant: any, index: number) => {
      colorMap.set(participant.userId, colors[index]);
    });
    return colorMap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.participants]);

  return (
    <>
      {/* need to title the event */}
      {/* {!loading && events && ( */}
      {/* <Heading padding="10px" position="absolute">
        {events.title}
      </Heading> */}
      <Flex overflow="hidden" position={'relative'} h="calc(100vh - 65px)" >


        <Box flexGrow="11.5">
          <Flex
            flexDirection="column"
            gap="20px"
            padding="10px"
            paddingRight="15px"
            height="100%"
            
           
          >
            <Box
              width="100%"
              height="100%"
              overflowY="scroll"
              padding="10px"
              paddingRight="20px"
              paddingLeft="20px"
              overflowX="hidden"
              
            >
              {messages.map((msg: any) => {
                const currentColor = participantColors.get(msg.userId);
                return (
                  <Message
                    content={msg.content}
                    picture={msg.user ? msg.user.picture : msg.picture}
                    createdAt={msg.createdAt}
                    own={Number(user.id) === Number(msg.userId) ? true : false}
                    color={currentColor}
                    msg={msg.user ? msg : ""}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </Box>
            <Box>
              <Form onSubmit={handleSubmit}>
                <Flex
                  justifyContent="space-between"
                  gap="20px"
                  alignItems="center"
                  bg={'white'}
                  position={'relative'}
                  
                  paddingRight={'20px'}
                  marginRight={'-15px'}
                  paddingTop={'20px'}
                  zIndex={'999'}
                  borderRadius={'-15px'}
                  shadow={'inset  0  5px 5px -5px rgba(0, 0, 0, 0.104)'}
                >
                  <Textarea
                    ref={messageToSendRef}
                    resize="none"
                    placeholder="Send Message"
                    isRequired
                    onKeyDown={(e)=>{
                      if(e.key === "Enter" && e.shiftKey === false){
                        handleSubmit()
                      }
                    }}
                  />
                  <IconButton
                    colorScheme="pink"
                    icon={<Icon as={AiOutlineSend} />}
                    aria-label="send"
                    type="submit"
                  />
                </Flex>
              </Form>
            </Box>
          </Flex>
        </Box>
        <Box flexGrow="1" position={'relative'} zIndex={100}shadow="0px 0px 5px rgba(0, 0, 0, 0.104)"  bg={'white'}  padding={'0'}  display={["none","none","none","flex"]}>
          <Flex                   marginBottom={'10px'} padding="10px"width="100%" overflowY="scroll">
            <AvatarGroup
              max={11}
              flexDir={"column-reverse"}
              alignItems="center"
              width="100%"
            >
              {events.participants &&
                events.participants.map((val: any, index: number) => (
                  <>
                    <FriendAvatar
                      events={events}
                      color={colors[index]}
                      item={val}
                    />
                  </>
                ))}
              {events.participants && events.participants.length < 10 && (
                <IconButton
                  marginTop={"10px"}
                  aria-label="add"
                  onClick={onOpen}
                  width={'100%'}
                  padding={'10px'}

                  icon={<Icon as={BiPlus} />}
                />
              )}
            </AvatarGroup>
          </Flex>
        </Box>
      </Flex>
      {/* )} */}
      {/* {!loading && ( */}
      <AddFriendToEvent
        isOpen2={isOpen}
        e={events}
        onClose2={onClose}
        accounts={accounts}
        setInviteLoading={setInviteLoading}
        inviteLoading={inviteLoading}
      />
      {/* )} */}
      <Box position="absolute" top={"40%"} left={"50%"}>
        <Confetti active={confetti} config={confettiConfig} />
      </Box>
    </>
  );
}
