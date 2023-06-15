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
import { AiOutlineDelete, AiOutlineMore } from "react-icons/ai";
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
        <Flex>
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

            {`${item.userId}` === `${events.ownerId}` && (
              <Badge marginRight="-50%" colorScheme="green">
                Owner
              </Badge>
            )}
          </Flex>

          {user.userId &&
            `${item.userId}` !== `${events.ownerId}` &&
            `${user.userId}` === `${events.ownerId}` && (
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
        </Flex>
      </CardHeader>
    </Card>
  );
}
