import { useEffect, useState } from "react";
import FriendsListSearch from "./friendsListSearch";
import FriendListAdd, { FriendListAddSearch } from "./friendListAdd";
import FriendListInbox from "./friendListInbox";
import {
  Flex,
  Icon,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import {
  AiOutlineUser,
  AiOutlineUsergroupAdd,
  AiOutlinePullRequest,
} from "react-icons/ai";
import IndividualFriend from "./friendComponents/individualFriend";
import { useAuth } from "../../hooks/authContext";

interface Account {
  username: string;
  profilePic: string;
}

export default function FriendsListCover() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();
  const { setRefreshEvent, refreshEvent } = useAuth();

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const handleDataUpdate = async (newData: any) => {
    setFetchedData(newData);
  };

  async function fetchData() {
    try {
      const response = await fetch(`/friends`, {
        method: "GET",
      });
      const result = await response.json();

      return result;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  const handleButtonClick = async (item: string) => {
    const data = JSON.stringify({
      username: item,
    });
    await fetch(`/removeFriend`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    setLastRefresh(Date.now());
    setRefreshEvent(true);
    toast({
      title: "Friend Removed.",
      status: "error",
      description: `${item} has been removed as a friend.`,
      duration: 4000,
    });
  };

  useEffect(() => {
    (async () => {
      setAccounts(await fetchData());
      setRefreshEvent(false);
    })();
  }, [lastRefresh, refreshEvent]);

  return (
    <>
      <Tabs
        index={tabIndex}
        onChange={handleTabsChange}
        position="relative"
        variant="unstyled"
      >
        <div style={{ position: "fixed" }}>
          <TabList>
            <Flex justifyContent="space-around" width="318px">
              <Tab flexGrow="1">
                <Icon
                  color={tabIndex === 0 ? "darkBlue" : "black"}
                  boxSize={6}
                  as={AiOutlineUser}
                />
              </Tab>
              <Tab flexGrow="1">
                <Icon
                  color={tabIndex === 1 ? "darkBlue" : "black"}
                  boxSize={6}
                  as={AiOutlinePullRequest}
                />
              </Tab>
              <Tab flexGrow="1">
                <Icon
                  color={tabIndex === 2 ? "darkBlue" : "black"}
                  boxSize={6}
                  as={AiOutlineUsergroupAdd}
                />
              </Tab>
            </Flex>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
            borderRadius="1px"
            backgroundColor="darkBlue"
          />
        </div>

        <div
          style={{
            position: "relative",
            top: "50px",
            height: "305px",
            width: "100%",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <TabPanels>
            <TabPanel key="1">
              {accounts &&
                !fetchedData &&
                accounts.map((item) => (
                  <>
                    <IndividualFriend
                      item={item}
                      handleButtonClick={(val: any) => handleButtonClick(val)}
                    />
                  </>
                ))}
              {fetchedData &&
                fetchedData.map((item: any) => (
                  <IndividualFriend
                    item={item}
                    handleButtonClick={(val: any) => handleButtonClick(val)}
                  />
                ))}
              <FriendsListSearch updateData={handleDataUpdate} />
            </TabPanel>
            <TabPanel key="2">
              <FriendListInbox
                lastRefresh={lastRefresh}
                setLastRefresh={(val: any) => setLastRefresh(val)}
              />
            </TabPanel>
            <TabPanel key="3">
              <FriendListAdd
                lastRefresh={lastRefresh}
                setLastRefresh={(val: any) => setLastRefresh(val)}
                searchText={searchText}
              />
              <FriendListAddSearch
                setSearchText={(val: any) => setSearchText(val)}
              />
            </TabPanel>
          </TabPanels>
        </div>
      </Tabs>
    </>
  );
}
