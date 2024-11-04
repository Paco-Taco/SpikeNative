import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { ErrorResponse, LoginRequest, LoginResponse } from "@/types/spikeLogin.types";
import { SpikeLoginService } from "@/services/spikeLoginService.service";

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

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      // console.log("stored: ", token);

      if (token) {
        // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
      const result = await SpikeLoginService.login(body);

      setAuthState({
        token: result.token,
        authenticated: true,
      });

      // axios.defaults.headers.common["Authorization"] = `Bearer ${result.token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, result.token);

      return result;
    } catch (e) {
      return { error: true, msg: (e as any) };
    }
  };

  const logout = async () => {
    // Delete token from storage
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    // Update HTTP headers
    // axios.defaults.headers.common["Authorization"] = "";

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
