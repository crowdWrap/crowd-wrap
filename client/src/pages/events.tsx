import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Progress,
  Text,
  useClipboard,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiShare, BiBomb, BiExit } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useAuth } from "../hooks/authContext";

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

async function fetchEvents(setEvents: any, setInviteLink: any) {
  const response: Response = await fetch("/events/retrieve", {
    method: "GET",
  });

  const receivedData = await response.json();
  await setEvents(receivedData);
  setInviteLink(
    `http://localhost:3000/events/invite/${
      receivedData[receivedData.length - 1].inviteLink
    }`
  );
}

// add a loading effect

export default function Events() {
  const [events, setEvents] = useState<any>([]);
  const [displayFriends, setDisplayFriends] = useState(null);
  const [accounts, setAccounts] = useState<any>([]);
  const [inviteLink, setInviteLink] = useState<string>("");
  const navigate = useNavigate();
  const { onCopy } = useClipboard(inviteLink);
  const toast = useToast();
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef: any = React.useRef();

  const { refreshEvent, setRefreshEvent, userId } = useAuth();

  useEffect(() => {
    let loaded = true;
    (async () => {
      if (loaded) {
        fetchEvents(setEvents, setInviteLink);
        setAccounts(await fetchData());
      }
      if (refreshEvent) {
        fetchEvents(setEvents, setInviteLink);
        setRefreshEvent(false);
      }
    })();
    return () => {
      loaded = false;
      setAccounts([]);
    };
  }, [refreshEvent]);

  const handleAddParticipant = (e: any, event: any) => {
    event.stopPropagation();
    if (e.id !== displayFriends) {
      setDisplayFriends(e.id);
    } else {
      setDisplayFriends(null);
    }
  };

  const handleInvite = async (item: any, e: any) => {
    const response: Response = await fetch(
      `/events/participants/add?username=${await item.username}&eventId=${await e.id}`,
      {
        method: "GET",
      }
    );

    setRefreshEvent(true);
    setDisplayFriends(null);
  };

  const removeEvent = async (e: any, event: any) => {
    event.stopPropagation();
    if (`${userId}` === `${e.ownerId}`) {
      await fetch(`/events/remove?eventId=${userId}&ownerId=${e.ownerId}`, {
        method: "GET",
      });
    } else {
      await fetch(
        `/events/participants/remove?userId=${userId}&eventId=${e.id}`,
        {
          method: "GET",
        }
      );
    }

    setRefreshEvent(true);
  };

  // const handleMoney = (e: any) => {
  //   const match = e.moneyGoal.match(/\d+/g);
  //   if (match[0] && match[1]) {
  //     return `${match[0]}-${match[1]}`;
  //   } else {
  //     return match[0];
  //   }
  // };

  const navigateEvent = (e: any) => {
    navigate(`/events/${e.title}-${e.id}`);
  };

  // const handleProgress = (e: any) => {
  //   const match = e.moneyGoal.match(/\d+/g);
  //   return match[0];
  // };

  const handleDate = (e: any) => {
    const dateObj = new Date(e.deadlineDate);
    const options: object = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    return formattedDate;
  };
  // I dont think tis being shown cause of overflow also, maybe in the link have ther be dashes in the spaces/ chatgpt
  return (
    <Flex padding="5px" paddingTop="50px" gap="15px" flexWrap="wrap">
      {events &&
        events.map((e: any) => (
          <>
            <Card key={e.id} marginTop="-10px" height="320px" width="md">
              <CardHeader>
                <Flex>
                  <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                    <Flex
                      marginTop="-10px"
                      justifyContent="space-between"
                      width="100%"
                      alignItems="center"
                    >
                      <Heading marginTop="5px" size="sm" color="grey">
                        {`${
                          e.deadlineDate === null
                            ? "No Deadline"
                            : handleDate(e)
                        }`}
                      </Heading>

                      {`${userId}` === `${e.ownerId}` && (
                        <Badge marginRight="-50%" colorScheme="green">
                          Owner
                        </Badge>
                      )}

                      <Menu>
                        <MenuButton
                          as={IconButton}
                          fontSize={"20px"}
                          aria-label="Options"
                          icon={<BsThreeDotsVertical />}
                          variant="ghost"
                          colorScheme="gray"
                        />
                        <MenuList>
                          <MenuItem
                            icon={
                              <Icon
                                color="green"
                                boxSize={5}
                                as={AiOutlineUserAdd}
                              />
                            }
                          >
                            Add friends to event
                          </MenuItem>
                          {`${userId}` === `${e.ownerId}` ? (
                            <MenuItem
                              onClick={() => {
                                setSelectedEvent(e.id);
                                onOpen();
                              }}
                              icon={
                                <Icon color="red" boxSize={5} as={BiBomb} />
                              }
                            >
                              Delete Event
                            </MenuItem>
                          ) : (
                            <MenuItem
                              onClick={() => {
                                setSelectedEvent(e.id);
                                onOpen();
                              }}
                              icon={
                                <Icon color="red" boxSize={5} as={BiExit} />
                              }
                            >
                              Leave Event
                            </MenuItem>
                          )}
                        </MenuList>
                      </Menu>
                    </Flex>

                    <Flex
                      marginTop="15px"
                      alignItems="center"
                      marginLeft="auto"
                      marginRight="auto"
                      gap="15px"
                    >
                      <Avatar
                        // would be img as the source, but we need to setup file
                        size={"lg"}
                        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fopenclipart.org%2Fimage%2F800px%2F194868&f=1&nofb=1&ipt=7f38c85f61d7fd658da37dac1b44303ac8e34889e6c30c205008f75acdad79e2&ipo=images"
                      />
                      <Box>
                        <Heading size="md">{e.title}</Heading>
                        <Text fontSize="0.8rem">{e.description}</Text>
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>
              </CardHeader>
              <CardBody marginTop="-10px">
                <Text>Progress:</Text>
                <Progress value={20} size="xs" colorScheme="pink" />
              </CardBody>

              <CardFooter
                justify="space-between"
                flexWrap="wrap"
                sx={{
                  "& > button": {
                    minW: "136px",
                  },
                }}
              >
                <AvatarGroup size="md" max={3}>
                  {events &&
                    e.participants.map((val: any) => (
                      <Avatar src={val.picture} />
                    ))}
                </AvatarGroup>
                <Button
                  marginTop="5px"
                  flex="0.5"
                  variant="ghost"
                  leftIcon={<BiShare />}
                  onClick={() => {
                    onCopy();
                    toast({
                      title: "Invite link copied to clipboard.",
                      status: "success",
                      duration: 2000,
                    });
                  }}
                >
                  Share
                </Button>
              </CardFooter>
            </Card>

            {/* {displayFriends === e.id &&
                    accounts &&
                    accounts
                      .filter((valu: any) => {
                        const hasMatchingUser = e.participants.some(
                          (user: any) => user.userId === valu.userId
                        );
                        return !hasMatchingUser ? valu : null;
                      })
                      .map((item: any, index: any) => (
                        <div className="invitee" key={item.username}>
                          <img alt="" src={item.profilePic} />
                          <p>{item.username}</p>
                          <FontAwesomeIcon
                            className="addParticipant"
                            onClick={() => handleInvite(item, e)}
                            icon={faPlus}
                          />
                        </div>
                      ))} */}

            {selectedEvent === e.id && (
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
              >
                <AlertDialogOverlay
                  bg="blackAlpha.300"
                  backdropFilter="blur(2px) hue-rotate(270deg)"
                >
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      {`${userId}` === `${e.ownerId}`
                        ? `Delete Event "${e.title}"`
                        : `Leave Event ${e.title}"`}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={(event) => {
                          removeEvent(e, event);
                          setSelectedEvent("");
                          onClose();
                        }}
                        ml={3}
                      >
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            )}
          </>
        ))}
    </Flex>
  );
}
