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
  const { refreshEvent } = useAuth();

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
    })();
  }, [eventId, refreshEvent]);

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
        <>
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
              <LoadingFriend />
              <LoadingFriend />
              <LoadingFriend />
              <LoadingFriend />
              <LoadingFriend />
              <LoadingFriend />
            </AvatarGroup>
          </Flex>

          {/* <div>{`InviteLink: http://localhost:3000/events/invite/${events.inviteLink}`}</div> */}
        </>
      )}
    </>
  );
}
