import { ReactNode, createContext, useEffect, useState } from "react";

import { UserDTO } from "../dtos/UserDTO";
import { api } from "../services/api";
import {
  storageUserSave,
  storageUserGet,
  storageUserRemove,
} from "../storage/storageUser";
import {
  storageAuthTokenSave,
  storageAuthTokenGet,
  storageAuthTokenRemove,
} from "../storage/storageAuthToken";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
  isLoadingUserStorageData: boolean;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
    } catch (error) {
      console.error(error);
      // Handle error as needed
    }
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStorageData(true);

      await storageUserSave(userData);
      await storageAuthTokenSave(token);
    } catch (error) {
      console.error(error);
      // Handle error as needed
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user && data.token) {
        userAndTokenUpdate(data.user, data.token);
        await storageUserAndTokenSave(data.user, data.token);
      }
    } catch (err) {
      console.error(err);
      // Handle error as needed
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();
      const token = await storageAuthTokenGet();

      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token);
      }
    } catch (err) {
      console.error(err);
      // Handle error as needed
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);
      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (err) {
      console.error(err);
      // Handle error as needed
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated);
      await storageUserSave(userUpdated);
    } catch (err) {
      console.error(err);
      // Handle error as needed
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        updateUserProfile,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
