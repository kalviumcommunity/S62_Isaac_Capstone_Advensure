import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("Guest User");

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/user/get-user", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser("Guest User");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser("Guest User");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
