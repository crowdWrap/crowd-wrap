import { useNavigate } from "react-router-dom";
import CreateEventPop from "./createEventPop";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
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
  Text,
  useDisclosure,
  useSteps,
} from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/authContext";

export default function CreateEventButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const finalRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

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
      setActiveStep(-1);
      setLoading(false);
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
          {user.paymentType !== "" && (
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
          )}
          <ModalCloseButton />
          <ModalBody overflow="hidden">
            {user.paymentType !== "" ? (
              <CreateEventPop
                activeStep={activeStep}
                setActiveStep={(val: number) => setActiveStep(val)}
                onClose={onClose}
              />
            ) : (
              <Flex
                flexDir="column"
                height="100%"
                justifyContent="space-evenly"
                alignItems="center"
              >
                <Flex flexDir="column" align="center" gap="15px">
                  <Heading>Create event with Paypal?</Heading>
                  <Text maxW={"85%"} textAlign="center">
                    In order to be able to receive funds from your events
                    participants, you would need to create a stripe account. We
                    use Stripe to get you paid quickly and keep your personal
                    and payment information secure. Please choose an option
                    below.
                  </Text>
                </Flex>
                <ButtonGroup>
                  <Button
                    onClick={() => {
                      setLoading(true);
                      // set payment type
                      setActiveStep(0);
                    }}
                    isLoading={loading}
                  >
                    No Payment
                  </Button>
                  <Button
                    onClick={() => {
                      setLoading(true);
                    }}
                    colorScheme="green"
                    isLoading={loading}
                  >
                    Continue with Stripe
                  </Button>
                </ButtonGroup>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
