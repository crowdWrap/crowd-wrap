import { Box, Flex, Image, Text } from "@chakra-ui/react";

export default function Message({ own }: any) {
  return (
    <Flex flexDir="column" alignItems={own ? "flex-end" : "flex-start"}>
      <Box
        marginTop="20px"
        display="flex"
        flexDir={own ? "row-reverse" : "row"}
        alignItems="center"
        gap="15px"
      >
        <Image
          width="32px"
          borderRadius="full"
          height="32px"
          src="https://yt3.ggpht.com/yti/AHyvSCBBYqwAK-WrD_CCKOk4375QKr6yBk7PHBpa6P3BOg=s108-c-k-c0x00ffffff-no-rj"
        ></Image>
        {own ? (
          <Text
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              bottom: "15px",
              right: "-10px",
              borderBottom: "15px solid pink",
              borderRight: "15px solid transparent",
            }}
            padding="10px"
            color={own ? "black" : "white"}
            borderRadius="20px"
            bgColor={own ? "pink" : "blueviolet"}
            maxWidth="300px"
          >
            {/* Have it pick a color for each user */}
            Hello
          </Text>
        ) : (
          <Text
            position="relative"
            _after={{
              content: '""',
              position: "absolute",
              top: "15px",
              left: "-10px",
              borderTop: "15px solid blueViolet",
              borderLeft: "15px solid transparent",
            }}
            padding="10px"
            color={own ? "black" : "white"}
            borderRadius="20px"
            bgColor={own ? "pink" : "blueviolet"}
            maxWidth="300px"
          >
            {/* Have it pick a color for each user, and display that color on the sidebar*/}
            Hello
          </Text>
        )}
      </Box>
      <Text marginTop="8px" fontSize="12px">
        1 hour ago
      </Text>
    </Flex>
  );
}
