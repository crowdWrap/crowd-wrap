import styles from "./logout.module.css";
import { useAuth } from "../../hooks/authContext";
import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SkeletonCircle,
  Tooltip,
} from "@chakra-ui/react";
import {
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlinePoweroff,
} from "react-icons/ai";

export default function LogoutButton() {
  const { profilePic, logout, loading } = useAuth();

  return (
    <>
      <Menu>
        {!loading && (
          // <Tooltip label="Account" bg="blackAlpha" color="black">
          <MenuButton
            style={{
              backgroundImage: `url(${profilePic})`,
              backgroundSize: "cover",
              borderRadius: "50%",
              height: "45px",
            }}
            as={Button}
            className={styles["logoutBtn"]}
          ></MenuButton>
          // </Tooltip>
        )}

        {loading && <SkeletonCircle size="10" />}

        <MenuList minWidth="120px">
          <MenuItem icon={<Icon boxSize={4} as={AiOutlineUser} />}>
            Profile
          </MenuItem>
          <MenuItem icon={<Icon boxSize={4} as={AiOutlineSetting} />}>
            Settings
          </MenuItem>
          <MenuItem
            onClick={logout}
            icon={<Icon boxSize={4} as={AiOutlinePoweroff} />}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
