import {
  Avatar,
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
import { useAuth } from "../../../hooks/authContext";
import { constants } from "../../../constants";

export default function ReceivedFriend({
  item,
  handleButtonAdd,
  handleButtonClick,
}: any) {
  const { setRefreshEvent } = useAuth();

  return (
    <Card style={{ marginBottom: "5px" }} key={item.username} maxW="md">
      <CardHeader>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              src={
                item.profilePic === constants.defaultProfilePic
                  ? null
                  : item.profilePic
              }
            />
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
                onClick={() => {
                  handleButtonAdd(item.username);
                  setRefreshEvent(true);
                }}
                icon={<Icon color="green" boxSize={5} as={AiOutlineUserAdd} />}
              >
                Add
              </MenuItem>
              <MenuItem
                onClick={() => handleButtonClick(item.username)}
                icon={<Icon color="red" boxSize={5} as={AiOutlineDelete} />}
              >
                Remove
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </CardHeader>
    </Card>
  );
}
