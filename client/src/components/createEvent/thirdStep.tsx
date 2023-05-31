import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Progress,
  Text,
  useToast,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiShare } from "react-icons/bi";

export default function ThirdStep({
  title,
  description,
  moneyGoal,
  date,
  img,
  setCurrentStep,
  setActiveStep,
  setShowEventComplete,
  moneyVal,
}: any) {
  const dateObj = new Date(date);
  const options: object = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = dateObj.toLocaleDateString("en-US", options);

  const toast = useToast();

  return (
    // a badge that signifies that ur the host, adn toast saying that u created the event
    <Flex
      height="400px"
      justifyContent="space-between"
      flexDir="column"
      alignItems="center"
      gap="10px"
    >
      <Card marginTop="-10px" width="md">
        <CardHeader>
          <Flex>
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Flex
                marginTop="-10px"
                justifyContent="space-between"
                width="100%"
                alignItems="center"
              >
                <Heading marginTop="5px" size="sm" color="grey">
                  {formattedDate}
                </Heading>
                <IconButton
                  variant="ghost"
                  colorScheme="gray"
                  aria-label="See menu"
                  icon={<BsThreeDotsVertical />}
                />
              </Flex>

              <Flex
                marginTop="15px"
                alignItems="center"
                marginLeft="auto"
                marginRight="auto"
                gap="15px"
              >
                <Avatar
                  // would be img as the source, but we need to setup file
                  size={"lg"}
                  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fopenclipart.org%2Fimage%2F800px%2F194868&f=1&nofb=1&ipt=7f38c85f61d7fd658da37dac1b44303ac8e34889e6c30c205008f75acdad79e2&ipo=images"
                />
                <Box>
                  <Heading size="md">{title}</Heading>
                  <Text fontSize="0.8rem">{description}</Text>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody marginTop="-10px">
          <Text>Progress:</Text>
          <Progress value={20} size="xs" colorScheme="pink" />
          <Text textAlign="right">{moneyVal}</Text>
        </CardBody>

        <CardFooter
          justify="space-between"
          flexWrap="wrap"
          sx={{
            "& > button": {
              minW: "136px",
            },
          }}
        >
          <AvatarGroup size="md" max={3}>
            <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
            <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
            <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
            <Avatar
              name="Prosper Otemuyiwa"
              src="https://bit.ly/prosper-baba"
            />
            <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
            <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
            <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
          </AvatarGroup>

          <Button
            marginTop="5px"
            flex="0.5"
            variant="ghost"
            leftIcon={<BiShare />}
          >
            Share
          </Button>
        </CardFooter>
      </Card>

      <ButtonGroup>
        <Button onClick={() => setActiveStep(1)}>Prev</Button>
        <Button
          onClick={() => {
            setActiveStep(3);
            setShowEventComplete(true);
            toast({
              title: "Event Created.",
              description: `"${title}" has been made.`,
              status: "success",
              duration: 4000,
            });
          }}
        >
          Confirm?
        </Button>
      </ButtonGroup>
    </Flex>
  );
}
