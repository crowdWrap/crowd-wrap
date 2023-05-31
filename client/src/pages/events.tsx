import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

import {
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
import { AiOutlineEnter, AiOutlineUserAdd } from "react-icons/ai";
import { useAuth } from "../hooks/authContext";
import RemoveEventDialog from "../components/events/alertDialog";
import AddFriendToEvent from "../components/events/addFriend";

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

export default function Events() {
  const [events, setEvents] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);
  const [inviteLink, setInviteLink] = useState<string>("");
  const navigate = useNavigate();
  const { onCopy } = useClipboard(inviteLink);
  const toast = useToast();
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

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
        setAccounts(await fetchData());
        setRefreshEvent(false);
      }
    })();
    return () => {
      loaded = false;
      // setAccounts([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshEvent]);

  // const handleMoney = (e: any) => {
  //   const match = e.moneyGoal.match(/\d+/g);
  //   if (match[0] && match[1]) {
  //     return `${match[0]}-${match[1]}`;
  //   } else {
  //     return match[0];
  //   }
  // };

  // const handleProgress = (e: any) => {
  //   const match = e.moneyGoal.match(/\d+/g);
  //   return match[0];
  // };

  const navigateEvent = (e: any) => {
    navigate(`/events/${e.title}-${e.id}`);
  };

  const handleDate = (e: any) => {
    const dateObj = new Date(e.deadlineDate);
    const options: object = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  return (
    <Flex padding="5px" paddingTop="50px" gap="15px" flexWrap="wrap">
      {events &&
        events.map((e: any) => (
          <React.Fragment key={e.id}>
            <Card marginTop="-10px" height="xs" width="md">
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
                            onClick={() => {
                              setSelectedEvent(e.id);
                              onOpen2();
                            }}
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
                          <MenuItem
                            onClick={() => {
                              navigateEvent(e);
                            }}
                            icon={
                              <Icon
                                color="green"
                                boxSize={5}
                                as={AiOutlineEnter}
                              />
                            }
                          >
                            Go to event
                          </MenuItem>
                          {`${userId}` === `${e.ownerId}` ? (
                            <MenuItem
                              onClick={() => {
                                setSelectedEvent(e.id);
                                onOpen1();
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
                                onOpen1();
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
                      <Avatar key={val.id} src={val.picture} />
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

            {/* make components */}

            {selectedEvent === e.id && accounts && (
              <AddFriendToEvent
                isOpen2={isOpen2}
                e={e}
                onClose2={onClose2}
                accounts={accounts}
                setSelectedEvent={(val: string) => setSelectedEvent(val)}
              />
            )}

            {selectedEvent === e.id && (
              <RemoveEventDialog
                e={e}
                onClose1={onClose1}
                isOpen1={isOpen1}
                setSelectedEvent={(val: string) => setSelectedEvent(val)}
              />
            )}
          </React.Fragment>
        ))}
    </Flex>
  );
}
