import { Flex, Box, Button } from "@chakra-ui/react";

export default function Buttoninfo({ text, icon, flexContent, ...props }: any) {
  return (
    <>
      {/* {!flexContent && <Divider />} */}
      <Button
        colorScheme="gray"
        backgroundColor="transparent"
        width="full"
        {...props}
      >
        <Flex
          alignItems="center"
          width="100%"
          justifyContent={flexContent ? "center" : "flex-start"}
        >
          <Box as={icon} boxSize={6} marginRight={2} />
          <Box>{text}</Box>
        </Flex>
      </Button>
    </>
  );
}
