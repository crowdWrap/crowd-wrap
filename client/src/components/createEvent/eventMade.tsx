import { useEffect, useState } from "react";
import {
  useClipboard,
  Button,
  Flex,
  IconButton,
  ButtonGroup,
  useToast,
  Icon,
  Avatar,
  Box,
  Card,
  CardHeader,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BiShare } from "react-icons/bi";
import { useAuth } from "../../hooks/authContext";
import { AiOutlinePlus } from "react-icons/ai";

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
  const navigate = useNavigate();
  const toast = useToast();

  const [inviteLink, setInviteLink] = useState<string>("Loading...");
  const { onCopy } = useClipboard(inviteLink);

  const { setRefreshEvent, refreshEvent } = useAuth();

  const [event, setEvent] = useState<any>();
  const [inviteLoading, setInviteLoading] = useState<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [accounts, setAccounts] = useState<any>([]);

  // const handleDataUpdate = async (newData: any) => {
  //   if (newData) {
  //     const filteredData = newData.filter((valu: any) => {
  //       const hasMatchingUser = event.participants.some(
  //         (user: any) => user.username === valu.username
  //       );
  //       return !hasMatchingUser ? valu : null;
  //     });
  //     setFetchedData(filteredData);
  //   } else {
  //     setFetchedData(null);
  //   }
  // };

  const handleInvite = async (item: any, e: any) => {
    setInviteLoading(item.username);
    const data = JSON.stringify({
      username: item.username,
      eventId: e.id,
    });
    await fetch(`/events/participants/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    setRefreshEvent(true);
    setTimeout(() => {
      setInviteLoading(null);
    }, 2000);
    // Timeout because for some reason the loading symbol is going away before it refreshes
    // Why does it take so long??
  };

  useEffect(() => {
    const fetchData = async () => {
      const response: Response = await fetch("/events/retrieve", {
        method: "GET",
      });

      const receivedData = await response.json();
      setInviteLink(
        `http://localhost:3000/events/invite/${receivedData[0].inviteLink}`
      );

      const friendResponse = await fetch(`/friends`, {
        method: "GET",
      });
      const result = await friendResponse.json();
      setAccounts(result);

      setEvent(receivedData[0]);
      setLoading(false);
      setRefreshEvent(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, refreshEvent]);

  return (
    <>
      {loading ? (
        <p>loading</p>
      ) : (
        <Box>
          <Heading textAlign={"center"} size={"sm"}>
            {`Add any friends to "${title}"?`}
          </Heading>
          <Flex
            paddingTop="10px"
            paddingBottom="10px"
            flexDirection="column"
            height="300px"
            overflowY="scroll"
            alignItems={"center"}
            gap="10px"
          >
            {!fetchedData &&
              accounts
                .filter((valu: any) => {
                  const hasMatchingUser = event.participants.some(
                    (user: any) => {
                      return user.userId === valu.userId;
                    }
                  );
                  return !hasMatchingUser ? valu : null;
                })
                .map((item: any, index: any) => (
                  <Card key={item.username} w="95%">
                    <CardHeader>
                      <Flex alignItems="center">
                        <Flex
                          flex="1"
                          gap="4"
                          alignItems="center"
                          flexWrap="wrap"
                        >
                          <Avatar
                            src={
                              item.profilePic ===
                              "https://vectorified.com/images/no-profile-picture-icon-28.png"
                                ? null
                                : item.profilePic
                            }
                          />
                          <Heading size="sm">{item.username}</Heading>
                        </Flex>
                        {inviteLoading ? (
                          <IconButton
                            isLoading
                            fontSize={"20px"}
                            aria-label="Add"
                            icon={<Icon as={AiOutlinePlus} />}
                          />
                        ) : (
                          <IconButton
                            onClick={() => {
                              handleInvite(item, event);
                              // setSelectedEvent("");
                            }}
                            fontSize={"20px"}
                            aria-label="Add"
                            icon={<Icon as={AiOutlinePlus} />}
                          />
                        )}
                      </Flex>
                    </CardHeader>
                  </Card>
                ))}
            {fetchedData &&
              fetchedData
                .filter((valu: any) => {
                  const hasMatchingUser = event.participants.some(
                    (user: any) => user.username === valu.username
                  );
                  return !hasMatchingUser ? valu : null;
                })
                .map((item: any) => {
                  return (
                    <Card
                      style={{ marginBottom: "5px" }}
                      key={item.username}
                      w="lg"
                    >
                      <CardHeader>
                        <Flex alignItems="center">
                          <Flex
                            flex="1"
                            gap="4"
                            alignItems="center"
                            flexWrap="wrap"
                          >
                            <Avatar
                              src={
                                item.profilePic ===
                                "https://vectorified.com/images/no-profile-picture-icon-28.png"
                                  ? null
                                  : item.profilePic
                              }
                            />
                            <Heading size="sm">{item.username}</Heading>
                          </Flex>
                          {loading === item.username ? (
                            <IconButton
                              isLoading
                              fontSize={"20px"}
                              aria-label="Invite"
                              icon={<Icon as={AiOutlinePlus} />}
                            />
                          ) : (
                            <IconButton
                              onClick={() => {
                                handleInvite(item, event);
                                // setSelectedEvent("");
                              }}
                              fontSize={"20px"}
                              aria-label="Invite"
                              icon={<Icon as={AiOutlinePlus} />}
                            />
                          )}
                        </Flex>
                      </CardHeader>
                    </Card>
                  );
                })}
          </Flex>
          <Flex marginTop="40px" justifyContent="center">
            <ButtonGroup>
              <Button
                onClick={() => {
                  navigate(`/events/${title}-${event.id}`);
                  onClose();
                }}
                size={"lg"}
              >
                Go to Event
              </Button>
              <IconButton
                aria-label="Share"
                size="lg"
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
        </Box>
      )}
    </>
  );
}
