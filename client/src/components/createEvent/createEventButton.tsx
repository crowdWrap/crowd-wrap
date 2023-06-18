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
import FlexWithText from "./flexWithText";

export default function CreateEventButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const finalRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);

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
      if (user.paymentType !== "") {
        setActiveStep(0);
      } else {
        setActiveStep(-1);
      }
      setLoading(false);
      setStatus(null);
    }
  }, [isOpen, setActiveStep, user.paymentType]);

  const handlePaymentUpdate = async (paymentType: string) => {
    const response: Response = await fetch("/payment/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentType,
      }),
    });

    const receivedData = await response.json();
    setUser(receivedData.user);
  };

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
              <>
                {!status && (
                  <FlexWithText
                    setLoading={setLoading}
                    setActiveStep={setActiveStep}
                    loading={loading}
                    headingText={"Create event with Paypal?"}
                    paragraphText={
                      "In order to be able to receive funds from your events participants, you would need to sign in to Paypal."
                    }
                    secondButton={true}
                    BtnText={"Continue with Paypal"}
                    setStatus={setStatus}
                  />
                )}
                {status && (
                  <FlexWithText
                    setLoading={setLoading}
                    handlePaymentUpdate={handlePaymentUpdate}
                    setActiveStep={setActiveStep}
                    loading={loading}
                    headingText={"Enter your Paypal Email!"}
                    paragraphText={
                      "Ensure that this is the correct email, the paypal connected to this email will receive your participants funds."
                    }
                    BtnText={"Confirm"}
                  />
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
