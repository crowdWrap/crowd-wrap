import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: any) {
  const [authed, setAuthed] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const response: Response = await fetch("/login", {
        method: "GET",
      });

      if (!response.ok) {
        setAuthed(true);
        fetchProfilePic();
      } else {
        setAuthed(false);
        setLoading(false);
      }
    })();
  });

  const fetchProfilePic = async () => {
    const response: Response = await fetch("/profilePicRequest", {
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
      setAuthed(false);
    } else {
      console.log(receivedData.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ authed, setAuthed, login, logout, profilePic, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
