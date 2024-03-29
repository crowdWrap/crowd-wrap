import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/authContext";
import React from "react";

export default function RemoveEventDialog({
  e,
  onClose1,
  isOpen1,
  setSelectedEvent,
}: any) {
  const { setRefreshEvent, user } = useAuth();
  const cancelRef: any = React.useRef();

  const removeEvent = async (e: any) => {
    const deleteData = JSON.stringify({
      ownerId: e.ownerId,
      eventId: e.id,
    });
    if (`${user.id}` === `${e.ownerId}`) {
      await fetch(`/events/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: deleteData,
      });
    } else {
      const leaveData = JSON.stringify({
        userId: user.id,
        eventId: e.id,
      });
      await fetch(`/events/participants/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: leaveData,
      });
    }

    setRefreshEvent(true);
  };

  return (
    <AlertDialog
      isOpen={isOpen1}
      leastDestructiveRef={cancelRef}
      onClose={onClose1}
      isCentered
    >
      <AlertDialogOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(2px) hue-rotate(270deg)"
      >
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {`${user.id}` === `${e.ownerId}`
              ? `Delete Event "${e.title}"`
              : `Leave Event "${e.title}"`}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose1}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={(event) => {
                removeEvent(e);
                setSelectedEvent("");
                onClose1();
              }}
              ml={3}
            >
              {`${user.id}` === `${e.ownerId}` ? `Delete` : `Leave`}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
