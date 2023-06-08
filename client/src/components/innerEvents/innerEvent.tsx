import { useEffect, useState } from "react";
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

  return (
    <>
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
                <Message />
                <Message own={true} />
                <Message />
                <Message />
                <Message own={true} />
                <Message own={true} />
                <Message />
                <Message />
                <Message own={true} />
                <Message />
                <Message />
                <Message />
                <Message />
                {/* if ther are multiplem essage from one user in a row then put date at bottom,
                same with the tail */}
              </Box>
              <Box>
                <Flex
                  justifyContent="space-between"
                  gap="20px"
                  alignItems="center"
                >
                  <Textarea resize="none" placeholder="Send Message"></Textarea>
                  <IconButton
                    colorScheme="pink"
                    icon={<Icon as={AiOutlineSend} />}
                    aria-label="send"
                  ></IconButton>
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
                // padding="15px"
              >
                {events.participants &&
                  events.participants.map((val: any) => {
                    return (
                      <>
                        <FriendAvatar events={events} item={val} />
                        {/* Display these peoples statuses */}
                      </>
                    );
                  })}
                <LoadingFriend />
                <LoadingFriend />
                <LoadingFriend />
                <LoadingFriend />
                <LoadingFriend />
                <LoadingFriend />
                <LoadingFriend />
              </AvatarGroup>
            </Flex>
          </Box>
          {/* <div className="innerTitleWrap">
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
            </div> */}

          {/* <Box flexDir="column" width="80%">
            <Heading padding="25px" fontWeight={"200"} textAlign="center">
              {events.title}
            </Heading>
            <Box width="80%" position="absolute">
              <Text textAlign="center">ChatBox</Text>
            </Box>
          </Box>

          

          {/* <Flex alignItems={"center"} justifyContent={"flex-end"}>
            <AvatarGroup
              max={8}
              flexDir={"column-reverse"}
              alignItems="center"
              overflowY="scroll"
              padding="15px"
              border="2px solid grey"
              borderStartRadius={"25px"}
            >
              {events.participants &&
                events.participants.map((val: any) => {
                  return (
                    <>
                      <FriendAvatar events={events} item={val} />
                    </>
                  );
                })}
              <LoadingFriend />
              <LoadingFriend />
              <LoadingFriend />
              <LoadingFriend />
              <LoadingFriend />
              <LoadingFriend />
            </AvatarGroup>
          </Flex> */}

          {/* <div>{`InviteLink: http://localhost:3000/events/invite/${events.inviteLink}`}</div> */}
        </Flex>
      )}
    </>
  );
}
