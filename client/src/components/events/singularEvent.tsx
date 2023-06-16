import {
  Card,
  CardHeader,
  Flex,
  Heading,
  Badge,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Icon,
  Avatar,
  Box,
  CardBody,
  Progress,
  CardFooter,
  AvatarGroup,
  Button,
  useClipboard,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineUserAdd, AiOutlineEnter } from "react-icons/ai";
import { BiBomb, BiExit, BiShare } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import events from "../../pages/events";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/authContext";

export default function SingularEvent({
  e,
  events,
  setSelectedEvent,
  onOpen1,
  onOpen2,
  needMenu,
}: any) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { onCopy } = useClipboard(
    `http://localhost:3000/events/invite/${e.inviteLink}`
  );

  const handleMoney = (e: any) => {
    const match = e.moneyGoal.match(/\d+/g);
    if (match[0] && match[1]) {
      return `${match[0]}-${match[1]}`;
    } else {
      return match[0];
    }
  };

  const handleProgress = (e: any) => {
    const match = e.moneyGoal.match(/\d+/g);
    return match[0];
  };

  const navigateEvent = (e: any) => {
    console.log(e);
    navigate(`/events/${e.title}-${e.id}`);
  };

  const handleDate = (e: any) => {
    const dateObj = new Date(e.deadlineDate);
    const options: object = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  return (
    <Card marginTop="-10px" height="xs" width="md">
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
                {`${e.deadlineDate === null ? "No Deadline" : handleDate(e)}`}
              </Heading>

              {`${user.id}` === `${e.ownerId}` && (
                <Badge marginRight="-50%" colorScheme="green">
                  Owner
                </Badge>
              )}

              {needMenu && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    fontSize={"20px"}
                    aria-label="Options"
                    icon={<BsThreeDotsVertical />}
                    variant="ghost"
                    colorScheme="gray"
                  />
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        setSelectedEvent(e.id);
                        onOpen2();
                      }}
                      icon={
                        <Icon color="green" boxSize={5} as={AiOutlineUserAdd} />
                      }
                    >
                      Add friends to event
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigateEvent(e);
                      }}
                      icon={
                        <Icon color="green" boxSize={5} as={AiOutlineEnter} />
                      }
                    >
                      Go to event
                    </MenuItem>
                    {`${user.id}` === `${e.ownerId}` ? (
                      <MenuItem
                        onClick={() => {
                          setSelectedEvent(e.id);
                          onOpen1();
                        }}
                        icon={<Icon color="red" boxSize={5} as={BiBomb} />}
                      >
                        Delete Event
                      </MenuItem>
                    ) : (
                      <MenuItem
                        onClick={() => {
                          setSelectedEvent(e.id);
                          onOpen1();
                        }}
                        icon={<Icon color="red" boxSize={5} as={BiExit} />}
                      >
                        Leave Event
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              )}
            </Flex>

            <Flex
              // marginTop="15px"
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
                <Heading size="md">{e.title}</Heading>
                <Text fontSize="0.8rem">{e.description}</Text>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody marginTop="-10px">
        <Text>Progress:</Text>
        <Progress
          value={Number(`${(e.Currentfunds / handleProgress(e)) * 100}`)}
          size="xs"
          colorScheme="pink"
        />
        <Text textAlign="right">{e.moneyGoal}</Text>
      </CardBody>

      <CardFooter
        marginTop="-10px"
        justify="space-between"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        <AvatarGroup size="md" max={5}>
          {events &&
            e.participants.map((val: any) => (
              <Avatar key={val.id} src={val.picture} />
            ))}
        </AvatarGroup>
        <Button
          marginTop="5px"
          flex="0.5"
          variant="ghost"
          leftIcon={<BiShare />}
          onClick={() => {
            setSelectedEvent(e.id);
            onCopy();
            toast({
              title: "Invite link copied to clipboard.",
              status: "success",
              duration: 2000,
            });
          }}
        >
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
