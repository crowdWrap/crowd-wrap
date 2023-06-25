import { Flex, Card, Avatar, IconButton, Text } from "@chakra-ui/react";
import { BiHeart, BiComment } from "react-icons/bi";

export default function IndividualFeed({ personal }: any) {
  return (
    <Flex padding={"12px"}>
      <Card
        flexDir="column"
        height="100px"
        padding="20px"
        //   alignItems="center"
        flexGrow="1"
      >
        <Flex width="100%" justifyContent="space-between">
          <Flex alignItems="center" gap="6px">
            <Avatar></Avatar>
            <Text fontSize={["0.85rem", "1rem"]} textAlign="left">
              <i>Garv</i> paid <strong>$5</strong> to{" "}
              {!personal ? <i>"Will's Birthday"</i> : "your event"}
            </Text>
          </Flex>
          <Flex alignItems={"center"} gap="7px">
            <IconButton
              cursor="pointer"
              size="xs"
              variant="unstyled"
              aria-label="like"
              _hover={{ color: "red" }}
              as={BiHeart}
            />
            <IconButton
              size="xs"
              cursor="pointer"
              variant="unstyled"
              aria-label="like"
              _hover={{ color: "blue" }}
              as={BiComment}
            />
          </Flex>
        </Flex>
        <Text left="6" bottom="4" position="absolute" fontSize="0.7rem">
          9h ago
        </Text>
      </Card>
    </Flex>
  );
}
