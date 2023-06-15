import { CircularProgress, Icon } from "@chakra-ui/react";
import {
  AiFillCheckCircle,
  AiFillExclamationCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai";

export default function ValidityCheck({ loading, usernameMsg }: any) {
  return (
    <>
      {loading ? (
        <CircularProgress
          isIndeterminate
          size="25px"
          position="absolute"
          color="green.300"
          right="15px"
          top="8px"
        />
      ) : !usernameMsg ? (
        <Icon
          size="25px"
          position="absolute"
          color="red.300"
          right="15px"
          top="12px"
          as={AiOutlineExclamationCircle}
        />
      ) : (
        <Icon
          size="25px"
          position="absolute"
          color="green.300"
          right="15px"
          top="12px"
          as={AiFillCheckCircle}
        />
      )}
    </>
  );
}
