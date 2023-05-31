import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Avatar,
  Card,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Icon,
  Box,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/authContext";
import { AiOutlinePlus } from "react-icons/ai";
import FriendsListSearch from "../friendList/friendsListSearch";
import { useState } from "react";

export default function AddFriendToEvent({
  isOpen2,
  onClose2,
  accounts,
  e,
  setSelectedEvent,
}: any) {
  const { setRefreshEvent } = useAuth();
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [inviteLoading, setInviteLoading] = useState<any>(null);

  const toast = useToast();

  const handleDataUpdate = async (newData: any) => {
    if (newData) {
      const filteredData = newData.filter((valu: any) => {
        const hasMatchingUser = e.participants.some(
          (user: any) => user.username === valu.username
        );
        return !hasMatchingUser ? valu : null;
      });
      setFetchedData(filteredData);
    } else {
      setFetchedData(null);
    }
  };

  const handleInvite = async (item: any, e: any) => {
    setInviteLoading(item.username);
    await fetch(
      `/events/participants/add?username=${await item.username}&eventId=${await e.id}`,
      {
        method: "GET",
      }
    );

    await setRefreshEvent(true);
    setTimeout(() => {
      setInviteLoading(null);
    }, 1000);
    // Timeout because for some reason the loading symbol is going away before it refreshes
    toast({
      title: `${item.username} has been invited to ${e.title}`,
      status: "success",
      duration: 2000,
    });
  };

  return (
    <Modal isCentered isOpen={isOpen2} onClose={onClose2}>
      <ModalOverlay />
      <ModalContent position="relative">
        <ModalHeader>{`Add friends to "${e.title}"`}</ModalHeader>
        <ModalCloseButton marginTop={"8px"} />
        <Box style={{ height: "300px", overflowY: "scroll" }}>
          <ModalBody>
            {!fetchedData &&
              accounts
                .filter((valu: any) => {
                  const hasMatchingUser = e.participants.some((user: any) => {
                    return user.userId === valu.userId;
                  });
                  return !hasMatchingUser ? valu : null;
                })
                .map((item: any, index: any) => (
                  <Card
                    style={{ marginBottom: "5px" }}
                    key={item.username}
                    maxW="md"
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
                              handleInvite(item, e);
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
                  const hasMatchingUser = e.participants.some(
                    (user: any) => user.username === valu.username
                  );
                  return !hasMatchingUser ? valu : null;
                })
                .map((item: any) => {
                  return (
                    <Card
                      style={{ marginBottom: "5px" }}
                      key={item.username}
                      maxW="md"
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

                          {inviteLoading === item.username ? (
                            <IconButton
                              isLoading
                              fontSize={"20px"}
                              aria-label="Add"
                              icon={<Icon as={AiOutlinePlus} />}
                            />
                          ) : (
                            <IconButton
                              onClick={() => {
                                handleInvite(item, e);
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
                  );
                })}
          </ModalBody>
        </Box>

        <ModalFooter position="relative">
          <FriendsListSearch eventUse={true} updateData={handleDataUpdate} />
          <Button colorScheme="blue" mr={3} onClick={onClose2}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
