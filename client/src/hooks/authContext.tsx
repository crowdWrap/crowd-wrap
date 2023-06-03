import { useContext, createContext, useState, useEffect } from "react";
import { socket } from "../api/socket";

const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: any) {
  const [authed, setAuthed] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshEvent, setRefreshEvent] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    (async () => {
      const response: Response = await fetch("/login", {
        method: "GET",
      });

      const receivedData = await response.json();

      if (response.ok) {
        socket.connect();
        setAuthed(true);
        fetchProfilePic();
        setUserId(receivedData.userId);
      } else {
        setAuthed(false);
        setLoading(false);
      }
    })();
  });

  const fetchProfilePic = async () => {
    const response: Response = await fetch("/profile/pic-request", {
      method: "GET",
    });

    const receivedData = await response.text();

    if (response.ok) {
      setProfilePic(receivedData);
      setLoading(false);
    } else {
      console.log("error");
    }
  };

  const login = async () => {
    const response: Response = await fetch("/login", {
      method: "GET",
    });
    const receivedData = await response.json();

    if (!response.ok) {
      setAuthed(true);
    } else {
      console.log(receivedData.message);
    }
  };

  const logout = async () => {
    const response: Response = await fetch("/logout", { method: "get" });
    const receivedData = await response.json();

    if (response.ok) {
      socket.disconnect();
      setAuthed(false);
    } else {
      console.log(receivedData.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authed,
        setAuthed,
        login,
        logout,
        profilePic,
        loading,
        setLoading,
        refreshEvent,
        setRefreshEvent,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
