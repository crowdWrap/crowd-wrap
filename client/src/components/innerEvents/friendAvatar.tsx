import {
  Avatar,
  AvatarBadge,
  Badge,
  Card,
  CardHeader,
  Flex,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { AiOutlineCrown, AiOutlineDelete, AiOutlineMore } from "react-icons/ai";
import { useAuth } from "../../hooks/authContext";

export default function FriendAvatar({ item, events, color }: any) {
  const { user, setRefreshEvent } = useAuth();

  const removeFromEvent = async (e: any) => {
    const leaveData = JSON.stringify({
      userId: e.userId,
      eventId: e.eventId,
    });
    await fetch(`/events/participants/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: leaveData,
    });
    setRefreshEvent(true);
  };

  return (
    <Card style={{ marginBottom: "5px" }} key={item.userId} width="100%">
      <CardHeader>
        <Flex alignItems="center">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              src={
                item.picture ===
                "https://vectorified.com/images/no-profile-picture-icon-28.png"
                  ? null
                  : item.picture
              }
            >
              <AvatarBadge boxSize="1.25em" bg={color} />
            </Avatar>
            <Heading size="sm">{item.username}</Heading>

            {`${item.userId}` === `${events.ownerId}` ? (
              <Badge
                fontSize="0.8rem"
                colorScheme="green"
                fontWeight="hairline"
                marginLeft="auto"
                marginRight={
                  `${user.id}` === `${events.ownerId}` ? "18px" : "10px"
                }
              >
                Owner
              </Badge>
            ) : (
              <Badge
                marginLeft="auto"
                marginRight="10px"
                fontSize="0.8rem"
                colorScheme="blue"
                fontWeight="hairline"
              >
                Paid: ${item.currentMoney}
              </Badge>
            )}
          </Flex>

          {user &&
            `${item.userId}` !== `${events.ownerId}` &&
            `${user.id}` === `${events.ownerId}` && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  fontSize={"20px"}
                  aria-label="Options"
                  icon={<Icon as={AiOutlineMore} />}
                  variant="ghost"
                  colorScheme="gray"
                />
                <MenuList>
                  <MenuItem
                    onClick={() => removeFromEvent(item)}
                    icon={<Icon color="red" boxSize={5} as={AiOutlineDelete} />}
                  >
                    Remove From Event
                  </MenuItem>

                  {/* <MenuItem
                         onClick={() => handleFriendRequest(item.username)}
                        icon={<Icon color="red" boxSize={5} as={AiOutlineDelete} />}
                      >
                        Send Friend Request
                     </MenuItem> */}
                </MenuList>
              </Menu>
            )}
          {user &&
            `${item.userId}` === `${events.ownerId}` &&
            `${user.id}` === `${events.ownerId}` && (
              <Icon
                marginRight="10px"
                boxSize={5}
                // color="yellow.300"
                as={AiOutlineCrown}
              />
            )}
        </Flex>
      </CardHeader>
    </Card>
  );
}
