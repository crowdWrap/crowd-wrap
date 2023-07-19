import {
  Box,
  Flex,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import {
  AiOutlineGlobal,
  AiOutlineUser,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import IndividualFeed from "../components/feed/individualFeed";

export default function Feed() {
  return (
    <Flex
      height="100vh"
      position="absolute"
      width="100vw"
      top="0"
      flexDir="column"
      alignItems="center"
      // height="90vh"
      overflowY="scroll"
      overflowX="hidden"
    >
      <Tabs
        width={["sm", "xl"]}
        align="center"
        isFitted
        isLazy
        lazyBehavior="unmount"
      >
        <Box
          width={["sm", "xl"]}
          position="fixed"
          backgroundColor="white"
          zIndex={5}
          paddingTop={"100px"}
          paddingBottom="25px"
        >
          <TabList>
            <Tab>
              <Icon boxSize="6" as={AiOutlineGlobal} />
            </Tab>
            <Tab>
              <Icon boxSize="6" as={AiOutlineUser} />
            </Tab>
            <Tab>
              <Icon boxSize="6" as={AiOutlineUsergroupAdd} />
            </Tab>
          </TabList>
        </Box>

        <TabPanels marginTop="135px">
          <TabPanel>
            <IndividualFeed />
            <IndividualFeed />
            <IndividualFeed />
            <IndividualFeed />
            <IndividualFeed />
            <IndividualFeed />
            <IndividualFeed />
            <IndividualFeed />
            <IndividualFeed />
          </TabPanel>
          <TabPanel>
            <IndividualFeed personal={true} />
          </TabPanel>
          <TabPanel>
            <IndividualFeed />
            <IndividualFeed />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
