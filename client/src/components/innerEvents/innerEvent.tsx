import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateEventButton from "../createEvent/createEventButton";
import FriendsList from "../friendList/friendslist";
import LogoutButton from "../logout/logout";
import "./innerEvents.css";
import FriendAvatar from "./friendAvatar";
import { useAuth } from "../../hooks/authContext";
import {
  AvatarGroup,
  Box,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import LoadingFriend from "../friendList/friendComponents/loadingFriend";
import {
  AiFillMoneyCollect,
  AiOutlineMessage,
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineUserSwitch,
} from "react-icons/ai";

export default function TheEvent() {
  const { id } = useParams();
  const dashIndex: any = id?.lastIndexOf("-");
  const eventId = id?.substring(dashIndex + 1);
  const title = id?.substring(0, dashIndex);
  const [events, setEvents] = useState<any>([]);
  const { refreshEvent, setRefreshEvent } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`/events/id?eventId=${eventId}`, {
        method: "GET",
      });

      const data = await response.json();
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

  return (
    <>
      {events && (
        <>
          <Box flexDir="column" width="80%">
            <Heading padding="25px" fontWeight={"200"} textAlign="center">
              {events.title}
            </Heading>
            <Box width="80%" position="absolute">
              <Text textAlign="center">ChatBox</Text>
            </Box>
          </Box>

          <ButtonGroup alignItems="center" height="80%" position="absolute">
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
            </Flex>
          </ButtonGroup>

          <Flex alignItems={"center"} justifyContent={"flex-end"}>
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
            </AvatarGroup>
          </Flex>

          {/* <div>{`InviteLink: http://localhost:3000/events/invite/${events.inviteLink}`}</div> */}
        </>
      )}
    </>
  );
}
