import {
  Avatar,
  AvatarBadge,
  Badge,
  Card,
  CardHeader,
  Flex,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { AiOutlineCrown, AiOutlineDelete, AiOutlineMore } from "react-icons/ai";
import { useAuth } from "../../hooks/authContext";

export default function IndividualReccomendation() {
  const { user, setRefreshEvent } = useAuth();
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
