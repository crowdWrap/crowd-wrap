import { useContext, createContext, useState, useEffect } from "react";
import { socket } from "../api/socket";

const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: any) {
  const [authed, setAuthed] = useState<boolean>(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshEvent, setRefreshEvent] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const response: Response = await fetch("/login", {
        method: "GET",
      });

      const receivedData = await response.json();

      if (response.ok) {
        socket.connect();
        setUser(receivedData.user);
        setAuthed(true);
        setLoading(false);
      } else {
        setAuthed(false);
        setLoading(false);
        setUser({});
      }
    })();
  }, []);

  const logout = async () => {
    const response: Response = await fetch("/logout", { method: "get" });
    const receivedData = await response.json();

    if (response.ok) {
      socket.disconnect();
      setAuthed(false);
      setUser({});
    } else {
      console.log(receivedData.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authed,
        setAuthed,
        logout,
        loading,
        setLoading,
        refreshEvent,
        setRefreshEvent,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
