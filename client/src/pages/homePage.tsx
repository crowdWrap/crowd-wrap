import { Link } from "react-router-dom";
import { Button, Stack } from "@chakra-ui/react";
import styles from "../assets/css_group/App.module.css";

export default function HomePage() {
  return (
    <div className={styles["App"]}>
      <div className={styles["btnWrap"]}>
        <Stack spacing="15px">
          <Link to="/register">
            <Button colorScheme="blackAlpha" className={styles["signupBtn"]}>
              {" "}
              Sign up
            </Button>
          </Link>
          <Link to="/login">
            <Button colorScheme="blackAlpha" className={styles["loginBtn"]}>
              {" "}
              Login
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              colorScheme="blackAlpha"
              className={styles["dashboard_button_example"]}
            >
              Dashboard Button Example
            </Button>
          </Link>
        </Stack>
      </div>
    </div>
  );
}
