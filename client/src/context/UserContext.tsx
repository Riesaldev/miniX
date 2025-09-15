import PropTypes from "prop-types";
import cookies from "js-cookie";

import { createContext, useState, useEffect, type ReactNode } from "react";

import toast from "react-hot-toast";

const { VITE_API_URL, VITE_AUTH_TOKEN } = import.meta.env;
// Fallback por si no está definida la variable en .env
const AUTH_COOKIE_NAME = VITE_AUTH_TOKEN || 'authToken';

interface User {
  id: string | number;
  username: string; // backend devuelve 'username'
  email: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt?: string; // podrían no venir siempre
  updatedAt?: string;
  // Campos adicionales tolerados sin tipado estricto
  [key: string]: unknown; // flexibilidad por si el backend añade algo
}

const UserContext = createContext<{
  user: User | null;
  loading: boolean;
  authToken: string | null;
  login: (token: string) => void;
  LogOut: () => void;
  updateAvatar: (avatar: string) => void;
  updateBio: (bio: string) => void;
} | null>(null);


interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {

  const initialToken = () => {
    const fromCookie = cookies.get(AUTH_COOKIE_NAME);
    const fromStorage = localStorage.getItem(AUTH_COOKIE_NAME) || null;
    return fromCookie || fromStorage || null;
  };
  const [authToken, setAuthToken] = useState<string | null>(initialToken);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const buildAvatarUrl = (raw?: string | null): string | null => {
    if (!raw) return null;
    // Si ya parece URL absoluta o data URI, devolver tal cual
    if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) return raw;
    const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || '';
    // El backend expone UPLOADS_DIR como static root, asumiendo UPLOADS_DIR=uploads
    return `${base}/${raw.replace(/^\//, '')}`; // raw es filename (e.g.  uuid.jpg )
  };

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

        // Normalizar claves para evitar errores si backend cambia mínimamente
        type ApiUser = Partial<User> & Record<string, unknown>;
        const apiUser: ApiUser = body.data.user as ApiUser;
        const normalized: User = {
          id: (apiUser.id as string | number) ?? '',
          username: (apiUser.username as string) || (apiUser.userName as string) || (apiUser.name as string) || '',
          email: (apiUser.email as string) || '',
          avatar: buildAvatarUrl(apiUser.avatar as string | null),
          bio: (apiUser.bio as string | null) ?? null,
          createdAt: apiUser.createdAt as string | undefined,
          updatedAt: (apiUser.updatedAt as string | undefined) || (apiUser.modifiedAt as string | undefined)
        };

        setUser(normalized);
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

    if (import.meta.env.DEV) {
      console.log('[UserContext] Cookie name:', AUTH_COOKIE_NAME, 'token inicial:', authToken);
    }

    if (authToken) fetchUser();
    else setLoading(false);

  }, [authToken]);

  const login = (token: string) => {
    if (import.meta.env.DEV) console.log('[UserContext] Guardando token', token);
    setAuthToken(token);
    cookies.set(AUTH_COOKIE_NAME, token, { expires: 7 });
    localStorage.setItem(AUTH_COOKIE_NAME, token);
  };

  const LogOut = () => {
    if (import.meta.env.DEV) console.log('[UserContext] Logout');
    setAuthToken(null);
    setUser(null);
    cookies.remove(AUTH_COOKIE_NAME);
    localStorage.removeItem(AUTH_COOKIE_NAME);
  };

  const updateAvatar = (avatar: User["avatar"]) => {
    if (user !== null) {
      setUser({
        ...user,
        avatar: buildAvatarUrl(avatar as string | null),
      });
    }
  };

  const updateBio = (bio: string) => {
    if (user !== null) {
      setUser({
        ...user,
        bio
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
        updateBio,
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