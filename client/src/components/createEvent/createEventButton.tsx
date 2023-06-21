import { useNavigate } from "react-router-dom";
import CreateEventPop from "./createEventPop";
import {
  Box,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useDisclosure,
  useSteps,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import React, { useEffect } from "react";

export default function CreateEventButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const finalRef = React.useRef(null);

  const steps = [
    { title: "First", description: "Details" },
    { title: "Second", description: "Info" },
    { title: "Third", description: "Demo" },
  ];

  const { setActiveStep, activeStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  useEffect(() => {
    if (!isOpen) {
      setActiveStep(0);
    }
  }, [isOpen]);

  return (
    <>
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button onClick={() => navigate("/events")}>Events</Button>
        <IconButton
          onClick={onOpen}
          aria-label="Add to friends"
          icon={<Icon as={AiOutlinePlus} />}
        />
      </ButtonGroup>
      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        size="2xl"
        isCentered
        onClose={onClose}
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(5px) hue-rotate(270deg)"
        />
        <ModalContent height="550px">
          <ModalHeader>
            <Stepper
              padding="15px"
              paddingTop="30px"
              size="md"
              colorScheme="red"
              index={activeStep}
            >
              {steps.map((step, index) => (
                <Step key={index}>
                  {/* onClick={() => setActiveStep(index)} */}
                  <StepIndicator
                  // style={{ cursor: "pointer", transition: "0.25s" }}
                  >
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>

                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>

                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow="hidden">
            <CreateEventPop
              activeStep={activeStep}
              setActiveStep={(val: number) => setActiveStep(val)}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
