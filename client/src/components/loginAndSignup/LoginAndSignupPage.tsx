import { Flex, Heading, Highlight, Box, Text, Image } from "@chakra-ui/react";
import { Form } from "react-router-dom";

export default function LoginAndSignupPage({
  handleSubmit,
  children,
  headingText,
  regText,
  full,
  ...props
}: any) {
  // const navigate = useNavigate();
  return (
    <Flex position="absolute" width="100%" height="100vh" {...props}>
      <Flex
        flexShrink="1"
        flexGrow="1"
        justifyContent="center"
        minWidth={["100%", "100%", "70%", "50%", "35%"]}
      >
        <Flex
          width={!full ? "70%" : ""}
          padding={full ? '25px' : ""}
          flexShrink={'1'}
          justifyContent={"center"}
          alignItems="center"
          flexDir="column"
        >
          <Flex
            width="100%"
            marginBottom="30px"
            flexDir="column"
            // alignItems="center"
          >
            <Heading letterSpacing="-1px" marginBottom="4px" fontWeight="700">
              <Highlight                 styles={{
                  px: "1",
                  py: "0",
                  rounded: "full",
                  bg: "red.100",
                }} query={"event"} >
                {headingText}
              </Highlight>
            </Heading>
            <Text
              marginLeft="0.5"
              letterSpacing="-0.5px"
              color="gray.600"
              fontWeight="200"
            >
              <Highlight
                styles={{
                  px: "1",
                  py: "1",
                  rounded: "full",
                  bg: "red.100",
                }}
                query={"social"}
              >
                {regText}
              </Highlight>
            </Text>
          </Flex>
          <Box width="100%">
            <Form onSubmit={handleSubmit}>
              <Flex
                position="relative"
                width="100%"
                gap="32px"
                flexDir="column"
              >
                {children}
              </Flex>
            </Form>
          </Box>
        </Flex>
      </Flex>
      <Image
        borderStartRadius="5px"
        maxWidth={["100%", "100%", "30%", "50%", "70%"]}
        height={"100%"}
        zIndex={"-2"}
        position={["absolute", "absolute", "relative", "relative", "relative"]}
        objectFit="cover"
        // onClick={() => navigate("/")}
        cursor={"pointer"}
        src="https://images.unsplash.com/photo-1520763185298-1b434c919102?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80"
      />
      <Flex
        position="absolute"
        zIndex={-1}
        display={["flex", "flex", "none"]}
        height="100%"
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          backgroundColor="white"
          height={full?"100%":"75%"}
          borderRadius="25px"
          width="100vw"
        />
      </Flex>
    </Flex>
  );
}
