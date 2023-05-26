import FriendsListCover from "./friendsListCover";
import {
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { FaUserFriends } from "react-icons/fa";
export default function FriendsList() {
  return (
    <>
      <Popover isLazy>
        <PopoverTrigger>
          <IconButton
            size={"sm"}
            // fontSize={"15px"}
            padding="0px"
            margin={"0"}
            variant="outline"
            borderRadius="full"
            colorScheme="facebook"
            aria-label="Friendlist"
            icon={<Icon as={FaUserFriends} />}
          />
        </PopoverTrigger>
        <PopoverContent
          height={"405px"}
          borderRadius={"25px "}
          style={{
            marginRight: "5px",
          }}
        >
          <PopoverArrow />
          <FriendsListCover />
        </PopoverContent>
      </Popover>
    </>
  );
}
