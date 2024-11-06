import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {
  ErrorResponse,
  LoginRequest,
  LoginResponse,
} from "@/types/spikeLogin.types";
import { SpikeLoginService } from "@/services/spikeLoginService.service";
import { useLoginStore } from "@/stores/login.store";
import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  //   onRegister?: (email: string, password: string) => Promise<any>;
  onLogin?: (body: LoginRequest) => Promise<LoginResponse | ErrorResponse>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "my-jwt";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });
  const { fetchLogin, cleanLoginStore } = useLoginStore((state) => state);

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      // console.log("stored: ", token);

      if (token) {
        axiosInstanceSpikeCore.defaults.headers.common["authorization"] = `Bearer ${token}`;

        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };
    loadToken();
  }, []);

  const login = async (body: LoginRequest) => {
    try {
      const result = await fetchLogin(body);

      if (result !== null) {
        setAuthState({
          token: result.token,
          authenticated: true,
        });

        axiosInstanceSpikeCore.defaults.headers.common["authorization"] = `Bearer ${result.token}`;

        await SecureStore.setItemAsync(TOKEN_KEY, result.token);

        return result;
      }
    } catch (e) {
      return { error: true, msg: (e as any) || "An unknown error occured" };
    }
  };

  const logout = async () => {
    // Delete token from storage
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    cleanLoginStore()
    // Update HTTP headers
    axiosInstanceSpikeCore.defaults.headers.common["authorization"] = "";

    // Reeset auth state
    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
