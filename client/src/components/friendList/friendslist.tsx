import { useState } from "react";
import styles from "./friendslist.module.css";
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
      <Popover>
        <PopoverTrigger>
          <IconButton
            margin={"0"}
            variant="outline"
            borderRadius="full"
            colorScheme="blue"
            aria-label="Friendlist"
            icon={<Icon as={FaUserFriends} />}
          />
        </PopoverTrigger>
        <PopoverContent
          height={"200px"}
          borderRadius={"25px "}
          style={{
            marginRight: "10px",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <PopoverArrow />
          <FriendsListCover />
        </PopoverContent>
      </Popover>
    </>
  );
}
