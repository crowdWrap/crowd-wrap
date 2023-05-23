import styles from "./header.module.css";
import { Link } from "react-router-dom";
import logoPrint from "../../assets/image_group/crowdwrap-print.svg";
import { Button, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import LogoutButton from "../logout/logout";
import CreateEventButton from "../createEvent/createEventButton";
import FriendsList from "../friendList/friendslist";
import { useAuth } from "../../hooks/authContext";
import { CgLogIn, CgHeart } from "react-icons/cg";

export default function Header() {
  const { authed } = useAuth();

  useEffect(() => {
    console.log("authed changed:", authed);
  }, [authed]);

  return (
    <div className={styles["header"]}>
      <Link to="/">
        <img src={logoPrint} alt="CrowdWrap-Title" className={styles["img"]} />
      </Link>

      {!authed && (
        <div className={styles["sign-links"]}>
          <Link to="/login" className={styles["sign-links__link"]}>
            <Button
              rightIcon={<Icon as={CgLogIn} />}
              // colorScheme="linkedin"
              variant="outline"
            >
              Login
            </Button>
          </Link>
          <Link to="/register" className={styles["sign-links__link"]}>
            <Button
              colorScheme="pink"
              // variant="outline"
              rightIcon={<Icon as={CgHeart} />}
            >
              Signup
            </Button>
          </Link>
        </div>
      )}
      {authed && (
        <div className={styles["navbarCover"]}>
          <CreateEventButton />
          <FriendsList />
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
