import { Link } from "react-router-dom";
import { Button, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Engineers from "../components/Engineers";
import styles from "../assets/css_group/App.module.css";

export default function HomePage() {
  const [counter, setCounter] = useState<number>(0);
  const [allEngineers, setAllEngineers] = useState<string[]>([]);
  const [showEngineers, setShowEngineers] = useState<Boolean>(false);
  const [className, setClassName] = useState<string>("");

  useEffect(() => {
    setClassName("startBtn startBtnActivated startBtnBuffer");
    setTimeout(() => {
      setClassName("startBtn startBtnActivated ");
      setShowEngineers(false);
    }, 250);
  }, [showEngineers]);

  const handleClick = async () => {
    setCounter(counter + 1);
    setShowEngineers(true);

    try {
      const response = await fetch("/crowdWrap/engineers");
      const json = await response.json();
      setAllEngineers(json);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles["App"]}>
      <h1 className={styles["title"]}>Server Test {counter} </h1>
      {showEngineers && <Engineers allEngineers={allEngineers} />}

      <div className={styles["btnWrap"]}>
        <Button colorScheme="red" className={className} onClick={handleClick}>
          Click Me!!!
        </Button>
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
