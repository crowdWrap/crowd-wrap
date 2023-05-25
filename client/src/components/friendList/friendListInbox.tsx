import FriendListInboxReceived from "./friendListInboxReceived";
import FriendListInboxSent from "./friendListInboxSent";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

export default function FriendListInbox({ lastRefresh, setLastRefresh }: any) {
  return (
    <>
      <Tabs position="relative" variant="soft-rounded">
        <TabList
          position={"fixed"}
          bottom={"10px"}
          width="140px"
          height="35px"
          marginTop="-10px"
        >
          <Tab>
            {/* <Flex alignItems={"center"} gap="5px"> */}
            <Text fontFamily={"Roboto"}>Received</Text>
            {/* <Icon boxSize={"4"} as={HiInbox} /> */}
            {/* </Flex> */}
          </Tab>
          <Tab>
            {/* <Flex alignItems={"center"} gap="5px"> */}
            <Text fontFamily={"Roboto"}>Sent</Text>
            {/* <Icon boxSize={"4"} as={FaLocationArrow} /> */}
            {/* </Flex> */}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <FriendListInboxReceived
              lastRefresh={lastRefresh}
              setLastRefresh={(val: any) => setLastRefresh(val)}
            />
          </TabPanel>
          <TabPanel>
            <FriendListInboxSent
              lastRefresh={lastRefresh}
              setLastRefresh={(val: any) => setLastRefresh(val)}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
