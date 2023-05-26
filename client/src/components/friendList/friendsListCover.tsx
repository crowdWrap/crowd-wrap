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
    await fetch(`/removeFriend?user_name=${item}`, {
      method: "GET",
    });
    setLastRefresh(Date.now());
    toast({
      title: "Friend Removed.",
      status: "error",
      description: `${item} has been removed as a friend.`,
      duration: 4000,
    });
  };

  useEffect(() => {
    let loaded = true;
    (async () => {
      if (loaded) {
        setAccounts(await fetchData());
      }
    })();
    return () => {
      loaded = false;
      setAccounts([]);
    };
  }, [lastRefresh]);

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
            {/* chcek their size in dev tools */}
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
            <TabPanel>
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
            <TabPanel>
              <FriendListInbox
                lastRefresh={lastRefresh}
                setLastRefresh={(val: any) => setLastRefresh(val)}
              />
            </TabPanel>
            <TabPanel>
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
