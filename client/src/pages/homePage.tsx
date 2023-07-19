import { Link } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <div>
      <div>
        <Flex
          height={"100vh"}
          alignItems={"center"}
          justifyContent={"space-around"}
        >
          <Link to="/register">
            <Button colorScheme="blackAlpha"> Sign up</Button>
          </Link>
          <Link to="/login">
            <Button colorScheme="blackAlpha"> Login</Button>
          </Link>
          <Link to="/dashboard">
            <Button colorScheme="blackAlpha">Dashboard Button Example</Button>
          </Link>
        </Flex>
      </div>
    </div>
  );
}
