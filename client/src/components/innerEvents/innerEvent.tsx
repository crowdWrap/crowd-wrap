import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CreateEventButton from "../createEvent/createEventButton";
import FriendsList from "../friendList/friendslist";
import LogoutButton from "../logout/logout";

import FriendAvatar from "./friendAvatar";
import { useAuth } from "../../hooks/authContext";
import {
  AvatarGroup,
  Box,
  ButtonGroup,
  Flex,
  Heading,
  Icon,
  IconButton,
  Text,
  Textarea,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import LoadingFriend from "../friendList/friendComponents/loadingFriend";
import {
  AiFillMoneyCollect,
  AiOutlineMessage,
  AiOutlineSend,
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineUserSwitch,
} from "react-icons/ai";
import Message from "./messenge";
import { BiShare } from "react-icons/bi";
import { socket } from "../../api/socket";

export default function TheEvent() {
  const { id } = useParams();
  const dashIndex: any = id?.lastIndexOf("-");
  const eventId = id?.substring(dashIndex + 1);
  const title = id?.substring(0, dashIndex);
  const [events, setEvents] = useState<any>([]);
  const { refreshEvent, setRefreshEvent } = useAuth();
  const toast = useToast();
  const [inviteLink, setInviteLink] = useState<string>("Loading...");
  const { onCopy } = useClipboard(inviteLink);
  const [messages, setMessages] = useState<any>([]);
  const [refreshMessages, setRefreshMessages] = useState(false);
  const messageToSendRef = useRef<any>("");
  const messagesEndRef = useRef<any>(null);
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  let eventParticipants: any = [];

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`/events/id?eventId=${eventId}`, {
        method: "GET",
      });

      const data = await response.json();
      setInviteLink(`http://localhost:3000/events/invite/${data.inviteLink}`);
      return data;
    };

    (async () => {
      setEvents(await fetchEvent());
      setRefreshEvent(false);
    })();
  }, [eventId, refreshEvent, setRefreshEvent]);

  useEffect(() => {
    // setLoading(true);
    const fetchMessages = async () => {
      const response = await fetch(`/events/${eventId}/messages`, {
        method: "GET",
      });
      const data = await response.json();
      return data.messages;
    };

    (async () => {
      setMessages(await fetchMessages());
      // setLoading(false);
      setRefreshMessages(false);
    })();
  }, [eventId, refreshMessages]);

  useEffect(() => {
    // console.log(messages);
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

  events.participants &&
    events.participants.map((el: any, index: number) => {
      eventParticipants[index] = el.userId;
    });

  return (
    <>
      {/* need to title the event */}
      {events && (
        <Flex overflow="hidden" h="calc(100vh - 57px)">
          <Box>
            <Flex padding="10px" alignItems="center" height="100%">
              <ButtonGroup>
                <Flex gap="25px" flexDir="column">
                  <IconButton
                    // messaging feature
                    boxSize="100px"
                    fontSize={"50px"}
                    icon={<AiOutlineMessage />}
                    aria-label="message"
                  ></IconButton>
                  <IconButton
                    // Will display the add screen and remove screen
                    boxSize="100px"
                    fontSize={"50px"}
                    icon={<AiOutlineUserSwitch />}
                    aria-label="users"
                  ></IconButton>
                  <IconButton
                    // will provide the option to change the name of the event, budget, etc
                    boxSize="100px"
                    fontSize={"50px"}
                    icon={<AiOutlineSetting />}
                    aria-label="setting"
                  ></IconButton>
                  <IconButton
                    // pay with venmo
                    boxSize="100px"
                    fontSize={"50px"}
                    icon={<AiFillMoneyCollect />}
                    aria-label="setting"
                  ></IconButton>
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
            </Flex>
          </Box>
          <Box flexGrow="6.5">
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
                {!loading &&
                  messages.map((msg: any) => {
                    const currentColor = eventParticipants.findIndex(
                      (element: number) => {
                        return element === Number(msg.userId);
                      }
                    );
                    return (
                      <Message
                        content={msg.content}
                        picture={msg.user ? msg.user.picture : msg.picture}
                        createdAt={msg.createdAt}
                        own={
                          Number(userId) === Number(msg.userId) ? true : false
                        }
                        color={colors[currentColor]}
                      />
                    );
                  })}
                <div ref={messagesEndRef} />
              </Box>
              <Box>
                <Flex
                  justifyContent="space-between"
                  gap="20px"
                  alignItems="center"
                >
                  {!loading ? (
                    <>
                      <Textarea
                        ref={messageToSendRef}
                        resize="none"
                        placeholder="Send Message"
                      />
                      <IconButton
                        colorScheme="pink"
                        icon={<Icon as={AiOutlineSend} />}
                        aria-label="send"
                        onClick={() => handleSubmit()}
                      />
                    </>
                  ) : (
                    <>
                      <Textarea
                        isDisabled
                        ref={messageToSendRef}
                        resize="none"
                        placeholder="Send Message"
                      />
                      <IconButton
                        isLoading
                        colorScheme="pink"
                        icon={<Icon as={AiOutlineSend} />}
                        aria-label="send"
                        onClick={handleSubmit}
                      />
                    </>
                  )}
                </Flex>
              </Box>
            </Flex>
          </Box>
          <Box>
            <Flex padding="10px" height="100%">
              <AvatarGroup
                max={10}
                flexDir={"column-reverse"}
                alignItems="center"
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
              </AvatarGroup>
            </Flex>
          </Box>
          {/* <div className="innerTitleWrap">
              <div className="innerData">{`${
                events.deadlineDate === null ? "No Deadline" : handleDate()
              }`}</div>
              {events.title}
              <p className="innerDesc">{events.description}</p>
              <div className="innerImgWrap">
                <h1 className="innerTitle">{events.title}</h1>
                <div className="innerImg">{`${events.image}`}</div>
              </div>
              <div className="innerFunds">{`CurrentFunds: ${events.Currentfunds}`}</div>
              <h4>Goal: {events.moneyGoal}</h4>
            </div> */}
        </Flex>
      )}
    </>
  );
}
