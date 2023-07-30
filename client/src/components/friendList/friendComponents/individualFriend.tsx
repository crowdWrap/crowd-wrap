import {
  Avatar,
  AvatarBadge,
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
import {
  AiOutlineDelete,
  AiOutlineUserAdd,
  AiOutlineMore,
} from "react-icons/ai";

export default function IndividualFriend({ item, handleButtonClick }: any) {
  return (
    <Card style={{ marginBottom: "5px" }} key={item.username} maxW="md">
      <CardHeader>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              src={
                item.profilePic ===
                "https://vectorified.com/images/no-profile-picture-icon-28.png"
                  ? null
                  : item.profilePic
              }
            >
              <AvatarBadge
                boxSize="1.25em"
                bg={item.status === "online" ? "green.500" : "red.400"}
              />
            </Avatar>
            <Heading size="sm">{item.username}</Heading>
          </Flex>
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
              isDisabled
                icon={<Icon color="green" boxSize={5} as={AiOutlineUserAdd} />}
              >
                Add to event
              </MenuItem>
              <MenuItem
                onClick={(event) => handleButtonClick(item.username)}
                icon={<Icon color="red" boxSize={5} as={AiOutlineDelete} />}
              >
                Remove Friend
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardHeader>
    </Card>
  );
}
