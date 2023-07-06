import styles from "./logout.module.css";
import { useAuth } from "../../hooks/authContext";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  SkeletonCircle,
  useDisclosure,
} from "@chakra-ui/react";
import { AiOutlineLogout, AiOutlineFieldTime } from "react-icons/ai";
import { RiListSettingsLine } from "react-icons/ri";
import React, { useEffect } from "react";
import Buttoninfo from "./buttonInfo";
import { BiGroup } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { RiFoldersLine } from "react-icons/ri";

export default function LogoutButton() {
  const { user, logout, loading } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<any>();
  const navigate = useNavigate();
  const location = useLocation();

  // console.log(user);
  return (
    <>
      {!loading ? (
        <>
          <Button
            ref={btnRef}
            onClick={isOpen ? onClose : onOpen}
            style={{
              backgroundImage: `url(${user.picture})`,
              backgroundSize: "cover",
              borderRadius: "50%",
              height: "45px",
            }}
            as={Button}
            className={styles["logoutBtn"]}
          />
          <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent borderStartRadius="15px">
              <DrawerCloseButton padding="20px" marginRight="12px" />
              <DrawerHeader padding="40px">
                <Flex flexDir="column" gap="35px">
                  <Flex
                    gap="10px"
                    // flexDir="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Avatar
                      // outline="2px solid pink"
                      src={user.picture}
                      boxSize="16"
                    />
                    <Flex flexDir="column">
                      <Heading fontSize={"1.8rem"}>{user.username}</Heading>
                      <Heading fontSize="1rem" color="gray.500">
                        {user.email}
                      </Heading>
                    </Flex>
                  </Flex>
                </Flex>
              </DrawerHeader>

              <DrawerBody>
                <Flex direction="column" width="100%" gap={4}>
                  <Buttoninfo
                    text="Events"
                    icon={RiFoldersLine}
                    onClick={() => {
                      if (location.pathname !== "/events") {
                        onClose();
                        navigate("/events");
                      }
                    }}
                    colorScheme={
                      location.pathname === "/events" ? "pink" : "gray"
                    }
                    backgroundColor={
                      location.pathname === "/events" ? "none" : "transparent"
                    }
                  />
                  <Divider />
                  <Buttoninfo text="Friend Feed" icon={BiGroup} />
                  <Divider />
                  <Buttoninfo text="Upcoming" icon={AiOutlineFieldTime} />
                  <Divider />
                  <Buttoninfo
                    text="Settings"
                    icon={RiListSettingsLine}
                    onClick={() => {
                      if (location.pathname !== "/settings") {
                        onClose();
                        navigate("/settings");
                      }
                    }}
                    colorScheme={
                      location.pathname === "/settings" ? "pink" : "gray"
                    }
                    backgroundColor={
                      location.pathname === "/settings" ? "none" : "transparent"
                    }
                  />
                  {/* <Divider /> */}
                </Flex>
              </DrawerBody>

              {/* <Flex marginTop="10px" justifyContent="space-evenly">
                <InfoBox
                  text={user.events.length - user.ownedEvents.length}
                  heading={"Events"}
                />
                <InfoBox text={user.ownedEvents.length} heading={"Owned"} />
              </Flex> */}
              <Divider />
              <DrawerFooter>
                <Buttoninfo
                  text="Log out"
                  icon={AiOutlineLogout}
                  flexContent={true}
                  _hover={{ color: "red" }}
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <SkeletonCircle size="10" />
      )}
    </>
  );
}
