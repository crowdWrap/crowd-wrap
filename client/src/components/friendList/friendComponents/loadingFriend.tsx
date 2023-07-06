import {
  Card,
  CardHeader,
  Flex,
  Icon,
  IconButton,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { AiOutlineMore } from "react-icons/ai";

export default function LoadingFriend() {
  return (
    <Card style={{ marginBottom: "5px" }} width="100%">
      <CardHeader>
        <Flex>
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <SkeletonCircle size="10" />
            <Skeleton height="12px" width="80px" />
          </Flex>
          <IconButton
            fontSize={"20px"}
            aria-label="Options"
            icon={<Icon as={AiOutlineMore} />}
            variant="ghost"
            colorScheme="gray"
          />
        </Flex>
      </CardHeader>
    </Card>
  );
}
