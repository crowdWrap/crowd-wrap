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
  useClipboard,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Message from "./messenge";
import { BiPlus } from "react-icons/bi";
import { socket } from "../../api/socket";
import AddFriendToEvent from "../events/addFriend";
import InnerOptions from "./innerOptions";
import { AiOutlineSend } from "react-icons/ai";

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
  const { refreshEvent, setRefreshEvent } = useAuth();
  const toast = useToast();
  const [inviteLink, setInviteLink] = useState<string>("Loading...");
  const { onCopy } = useClipboard(inviteLink);
  const [messages, setMessages] = useState<any>([]);
  const [refreshMessages, setRefreshMessages] = useState(false);
  const messageToSendRef = useRef<any>("");
  const messagesEndRef = useRef<any>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any>([]);
  const [refreshInner, setRefreshInner] = useState(false);
  const navigate = useNavigate();

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

      const isInside = data.event.participants.filter(
        (participant: any) => Number(participant.userId) === Number(user.id)
      );

      if (isInside.length === 0) {
        navigate("/events");
      } else {
        setInviteLink(`http://localhost:3000/events/invite/${data.inviteLink}`);
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
    })();
  }, [eventId, navigate, refreshEvent, setRefreshEvent, user.id, refreshInner]);

  useEffect(() => {
    socket.on("eventUpdate", (data) => {
      setRefreshInner(true);
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
  }, [setRefreshEvent, toast]);

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
    const receivedData = await response.json();
    if (messages.length > 0) {
      setMessages([...messages, receivedData.messageWithPicture]);
    } else {
      setMessages([receivedData.messageWithPicture]);
    }
    messageToSendRef.current.value = "";
  };

  const handleDate = () => {
    const dateObj = new Date(events.deadlineDate);
    const options: object = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  // const handleProgress = () => {
  //   const match = events.moneyGoal.match(/\d+/g);
  //   return match[0];
  // };

  // const handleMoney = () => {
  //   const match = events.moneyGoal.match(/\d+/g);
  //   if (match[0] && match[1]) {
  //     return `${match[0]}-${match[1]}`;
  //   } else {
  //     return match[0];
  //   }
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
      {!loading && events && (
        <Flex overflow="hidden" h="calc(100vh - 57px)">
          <Box>
            <Flex padding="10px" alignItems="center" height="100%">
              <InnerOptions onCopy={onCopy} events={events} />
            </Flex>
          </Box>
          <Box flexGrow="11.5">
            <Flex
              flexDirection="column"
              gap="20px"
              padding="10px"
              paddingRight="10px"
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
                      own={
                        Number(user.id) === Number(msg.userId) ? true : false
                      }
                      color={currentColor}
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
                  >
                    <Textarea
                      ref={messageToSendRef}
                      resize="none"
                      placeholder="Send Message"
                      isRequired
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
          <Box flexGrow="1">
            <Flex padding="10px" height="100%" width="100%" overflowY="scroll">
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
                    icon={<Icon as={BiPlus} />}
                  />
                )}
              </AvatarGroup>
            </Flex>
          </Box>
          <div className="innerTitleWrap">
            <div className="innerData">{`${
              events.deadlineDate === null ? "No Deadline" : handleDate()
            }`}</div>
            <p className="innerDesc">{events.description}</p>
            <div className="innerImgWrap">
              <h1 className="innerTitle">{events.title}</h1>
              <div className="innerImg">{`${events.image}`}</div>
            </div>
            <div className="innerFunds">{`CurrentFunds: ${events.Currentfunds}`}</div>
            <h4>Goal: {events.moneyGoal}</h4>
          </div>
        </Flex>
      )}
      {!loading && (
        <AddFriendToEvent
          isOpen2={isOpen}
          e={events}
          onClose2={onClose}
          accounts={accounts}
        />
      )}
    </>
  );
}
