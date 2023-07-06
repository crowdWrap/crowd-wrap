import { Avatar, Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import { format } from "timeago.js";

export default function Message({
  own,
  content,
  picture,
  color,
  createdAt,
}: any) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const segments = content.split(urlRegex);

  return (
    <Flex flexDir="column" alignItems={own ? "flex-end" : "flex-start"}>
      <Box
        marginTop="20px"
        display="flex"
        flexDir={own ? "row-reverse" : "row"}
        alignItems="center"
        gap="15px"
      >
        {picture ? (
          <Avatar
            width="32px"
            borderRadius="full"
            height="32px"
            src={picture}
          ></Avatar>
        ) : (
          <Avatar width="32px" borderRadius="full" height="32px"></Avatar>
        )}
        {own ? (
          <Text
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              bottom: "15px",
              right: "-10px",
              borderBottom: `15px solid ${color}`,
              borderRight: "15px solid transparent",
            }}
            padding="10px"
            color={"white"}
            borderRadius="20px"
            bgColor={color}
            maxWidth="300px"
          >
            {segments.map((segment: any, index: number) => {
              if (urlRegex.test(segment)) {
                return (
                  <Link
                    key={index}
                    href={segment}
                    target="_blank"
                    rel="noreferrer"
                    color="cadetblue"
                  >
                    {segment}
                  </Link>
                );
              } else {
                return <Text key={index}>{segment}</Text>;
              }
            })}
          </Text>
        ) : (
          <Text
            position="relative"
            _after={{
              content: '""',
              position: "absolute",
              top: "15px",
              left: "-10px",
              borderTop: `15px solid ${color}`,
              borderLeft: "15px solid transparent",
            }}
            padding="10px"
            color={"white"}
            borderRadius="20px"
            bgColor={color ? color : "blackAlpha.500"}
            maxWidth="300px"
          >
            {content}
          </Text>
        )}
      </Box>
      <Text marginTop="8px" fontSize="12px">
        {format(createdAt)}
      </Text>
    </Flex>
  );
}