import styles from "./header.module.css";
import { Link } from "react-router-dom";
import logoPrint from "../../assets/image_group/crowdwrap-print.svg";
import { Box, Button, Icon, Image, Progress } from "@chakra-ui/react";
import LogoutButton from "../logout/logout";
import CreateEventButton from "../createEvent/createEventButton";
import FriendsList from "../friendList/friendslist";
import { useAuth } from "../../hooks/authContext";
import { CgLogIn } from "react-icons/cg";
import { BsArrowThroughHeart } from "react-icons/bs";
import "@fontsource/inter";
import { useEffect } from "react";

export default function Header() {
  const { authed, loading, user } = useAuth();

  useEffect(() => {}, [user, user.usernameSet]);

  return (
    <div className={styles["header"]}>
      <Link to="/">
        <Image
          src={logoPrint}
          alt="CrowdWrap-Title"
          className={styles["img"]}
        />
      </Link>
      {loading && (
        <>
          <Progress
            position={"absolute"}
            top="0"
            left="0"
            width="100vw"
            height={"5px"}
            size="lg"
            isIndeterminate
          />
        </>
      )}
      {!loading && (
        <>
          {!authed && (
            <Box className={styles["sign-links"]}>
              <Link to="/login" className={styles["sign-links__link"]}>
                <Button rightIcon={<Icon as={CgLogIn} />} variant="outline">
                  Login
                </Button>
              </Link>
              <Link to="/register" className={styles["sign-links__link"]}>
                <Button
                  colorScheme="pink"
                  rightIcon={<Icon as={BsArrowThroughHeart} />}
                >
                  Signup
                </Button>
              </Link>
            </Box>
          )}
          {authed && (
            <Box className={styles["navbarCover"]}>
              {user && user.usernameSet && (
                <>
                  <CreateEventButton />
                  {/* <FriendsList /> */}
                </>
              )}
              <LogoutButton />
            </Box>
          )}
        </>
      )}
    </div>
  );
}
