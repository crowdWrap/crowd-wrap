import styles from "./header.module.css";
import { Link } from "react-router-dom";
import logoPrint from "../../assets/image_group/crowdwrap-print.svg";
import { Box, Button, ButtonGroup, Heading, Icon, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Progress } from "@chakra-ui/react";
import LogoutButton from "../logout/logout";
import CreateEventButton from "../createEvent/createEventButton";
import FriendsList from "../friendList/friendslist";
import { useAuth } from "../../hooks/authContext";
import "@fontsource/inter";
import { useEffect } from "react";
import { useLocation } from 'react-router-dom'
import { FaAngleLeft } from "react-icons/fa";
import { AiOutlineSetting } from "react-icons/ai";
import InnerOptions from "../innerEvents/innerOptions";

export default function Header() {
  const { authed, loading, user, currentEvent} = useAuth();
  useEffect(() => {}, [user, user.usernameSet]);
  const location:any = useLocation().pathname;
  const pathnameSegments = location.split('/');
  return (
    <>
      {loading && (
        <Progress
          zIndex={99}
          position={"absolute"}
          top="0"
          left="0"
          backgroundColor="transparent"
          width="100vw"
          height={"5px"}
          size="lg"
          isIndeterminate
        />
      )}
      {!loading && authed && (location !== "/" && location !== "/register" && location !== "/login" && location !== "/login/forgot") && (
        <Box
          shadow="0px 0px 5px rgba(0, 0, 0, 0.164)"
          className={styles["header"]}
        >
          {!pathnameSegments[2] ? (
             <><Link to="/">
              <Image
                src={logoPrint}
                alt="CrowdWrap-Title"
                className={styles["img"]} />
            </Link>
            <Box className={styles["navbarCover"]}>
                {user && user.usernameSet && (
                  <>
                    <CreateEventButton />
                    <FriendsList />
                  </>
                )}
                <LogoutButton />
              </Box>
              </>
 
          ) : (
            <>
         <ButtonGroup >
         <IconButton marginRight={'-12px'} as={Link} to="/events" backgroundColor={'transparent'} color={'pink.500'} aria-label="back to events" icon={<Icon boxSize={8} as={FaAngleLeft} />} />
         <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<Icon color={'gray.600'} boxSize={7} as={AiOutlineSetting} />}
            variant='ghost'
          />
            <InnerOptions events={currentEvent} />
        </Menu>
  
         </ButtonGroup>
            <Heading size="lg">{currentEvent.title}</Heading>
            <Box className={styles["navbarCover"]}>
                {user && user.usernameSet && (
                  <>
                    <FriendsList />
                  </>
                )}
                <LogoutButton />
              </Box>
            </>
          )}
          <>

          </>
        </Box>
 
      )}
      {location === "/" && (
        <Box
        shadow="0px 0px 5px rgba(0, 0, 0, 0.164)"
        className={styles["header"]}
      >
            <Link to="/">
            <Image
              src={logoPrint}
              alt="CrowdWrap-Title"
              className={styles["img"]}
            />
          </Link>
          <Box className={styles["navbarCover"]}>
            <Button as={Link} to="/register" colorScheme="red">Sign up for free</Button>
            <Button as={Link} to="/login" >Sign in</Button>
            </Box>
          </Box>
      )}
    </>
  );
}
