import FriendListInboxReceived from "./friendListInboxReceived";
import FriendListInboxSent from "./friendListInboxSent";
import {
  Flex,
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
          width="318px"
          height="35px"
          marginTop="-10px"
          left="0"
          justifyContent="center"
        >
          <Flex width="300px" justifyContent="space-around">
            <Tab flexGrow="1">
              <Text>Received</Text>
            </Tab>
            <Tab flexGrow="1">
              <Text>Sent</Text>
            </Tab>
          </Flex>
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
