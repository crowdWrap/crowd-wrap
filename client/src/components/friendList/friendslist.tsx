import FriendsListCover from "./friendsListCover";
import {
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  useToast,
} from "@chakra-ui/react";
import { FaUserFriends } from "react-icons/fa";

export default function FriendsList({ children }: any) {
  return (
    <>
      <Popover isLazy placement={"top"}>
        <PopoverTrigger>
          {/* <IconButton
            size={"sm"}
            // fontSize={"15px"}
            padding="0px"
            margin={"0"}
            variant="outline"
            borderRadius="full"
            colorScheme="pink"
            aria-label="Friendlist"
            icon={<Icon as={FaUserFriends} />}
          /> */}
          {children}
        </PopoverTrigger>
        <PopoverArrow />
        <PopoverContent height={"405px"} borderRadius={"25px "}>
          <FriendsListCover />
        </PopoverContent>
      </Popover>
    </>
  );
}
