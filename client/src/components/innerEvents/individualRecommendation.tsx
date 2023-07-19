import {
  Avatar,
  AvatarBadge,
  Card,
  CardHeader,
  Flex,
  Heading,
} from "@chakra-ui/react";

export default function IndividualReccomendation() {
  return (
    <Card
      style={{ marginBottom: "5px" }}
      //  key={item.userId}
      width="100%"
    >
      <CardHeader>
        <Flex alignItems="center">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              src={
                "https://vectorified.com/images/no-profile-picture-icon-28.png"
              }
            >
              <AvatarBadge boxSize="1.25em" bg={"black"} />
            </Avatar>
            <Heading size="sm">{"garvdaOg"}</Heading>
          </Flex>
        </Flex>
      </CardHeader>
    </Card>
  );
}
