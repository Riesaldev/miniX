import PropTypes from "prop-types";
import cookies from "js-cookie";

import { createContext, useState, useEffect, type ReactNode } from "react";

import toast from "react-hot-toast";

const { VITE_API_URL, VITE_AUTH_TOKEN } = import.meta.env;

interface User {
  id: string;
  userName: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

const UserContext = createContext<{
  user: User | null;
  loading: boolean;
  authToken: string | null;
  login: (token: string) => void;
  LogOut: () => void;
  updateAvatar: (avatar: string) => void;
} | null>(null);


interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {

  const [authToken, setAuthToken] = useState(
    cookies.get(VITE_AUTH_TOKEN) || null
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/users/profile`,
          {
            headers: authToken ? { Authorization: authToken } : {},
          });

        const body = await res.json();
        if (body.status === "error") {
          throw new Error(body.message);
        }

        setUser(body.data.user);
      } catch (err: unknown) {
        LogOut();
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Session expired. Please log in again.";
        toast.error(errorMessage, {
          id: "fetch-user-error"
        });
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchUser();
    }

  }, [authToken]);

  const login = (token: string) => {
    setAuthToken(token);
    cookies.set(VITE_AUTH_TOKEN, token, { expires: 7 });
  };

  const LogOut = () => {
    setAuthToken(null);
    setUser(null);
    cookies.remove(VITE_AUTH_TOKEN);
  };

  const updateAvatar = (avatar: User["avatar"]) => {
    if (user !== null) {
      setUser({
        ...user,
        avatar,
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        authToken,
        login,
        LogOut,
        updateAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };