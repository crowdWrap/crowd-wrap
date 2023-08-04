import styles from "./header.module.css";
import { Link } from "react-router-dom";
import logoPrint from "../../assets/image_group/crowdwrap-print.svg";
import { Box, Button, ButtonGroup, CircularProgress, CircularProgressLabel, Flex, Heading, Icon, IconButton, Image, Progress, useDisclosure } from "@chakra-ui/react";
import LogoutButton from "../logout/logout";
import CreateEventButton from "../createEvent/createEventButton";
import FriendsList from "../friendList/friendslist";
import { useAuth } from "../../hooks/authContext";
import "@fontsource/inter";
import { useEffect } from "react";
import { useLocation } from 'react-router-dom'
import { FaAngleLeft } from "react-icons/fa";
import { AiOutlineSetting } from "react-icons/ai";
import OptionCover from "../innerEvents/options/optionCover";

export default function Header() {
  const { authed, loading, user, currentEvent} = useAuth();
  useEffect(() => {}, [user, user.usernameSet]);
  const location:any = useLocation().pathname;
  const pathnameSegments = location.split('/');
  const { onOpen, isOpen, onClose } = useDisclosure();

  const handleProgress = (e: any) => {
    const match = e.moneyGoal.match(/\d+/g);
    return match[0];
  };



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
      {!loading && authed && (location !== "/" && location !== "/register" && location !== "/login" && !location.includes('/invite') &&  !location.includes('/profile') && location !== "/login/forgot") && (
        <Box
          shadow="0px 0px 5px rgba(0, 0, 0, 0.104)"
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
          <IconButton
            aria-label='Options'
            icon={<Icon color={'gray.600'} boxSize={7} as={AiOutlineSetting} />}
            variant='ghost'
            onClick={onOpen}
          />
          
          <OptionCover isOpen={isOpen} onClose={onClose} events={currentEvent}/>
         </ButtonGroup>
            <Flex alignItems={'center'}  gap={'15px'}>
            {currentEvent && currentEvent.Currentfunds ? (
              <>
                <CircularProgress
                
                  marginTop="50px"
                  value={Number(
                    `${(currentEvent.Currentfunds / handleProgress(currentEvent)) * 100}`
                  )}
                  size="55px"
                  color="green.400"
                >
                  <CircularProgressLabel>
                    ${currentEvent.Currentfunds}
                  </CircularProgressLabel>
                </CircularProgress>
                
              </>
            ) : (
              <>
                <CircularProgress value={0} size="55px" color="green.400">
                  <CircularProgressLabel>$0</CircularProgressLabel>
                </CircularProgress>
                {/* <InnerOptions onCopy={onCopy} events={events} /> */}
              </>
            )}
            <Heading display={["none", "block"]} fontWeight={"extrabold"} size="lg">{currentEvent.title}</Heading>
            </Flex>

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
            <Link  to="/">
              <Image
                display={["none", "block"]}
                src={logoPrint}
                alt="CrowdWrap-Title"
                className={styles["img"]}
              />
          </Link>
          <Flex justifyContent={['space-between', "end"]} width={['100%', "fit-content"]} className={styles["navbarCover"]}>
            <Button  as={Link} to="/register" colorScheme="red">Sign up for free</Button>
            <Button as={Link} to="/login" >Sign in</Button>
            </Flex>
          </Box>
      )}
    </>
  );
}
