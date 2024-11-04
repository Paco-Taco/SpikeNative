import { SpikeLoginService } from "@/services/spikeLoginService.service";
import { LoginRequest, LoginResponse } from "@/types/spikeLogin.types";
import { create, StateCreator } from "zustand";

interface LoginState {
  dataLogin?: LoginResponse;
  fetchLogin: (data: LoginRequest) => Promise<LoginResponse | undefined>;
  cleanLoginStore: () => void;
}

const storeApi: StateCreator<LoginState> = (set, get) => ({
  dataLogin: undefined,

  fetchLogin: async (body: LoginRequest) => {
    try {
      const data = await SpikeLoginService.login(body);
      set({ dataLogin: data });
      return data
    } catch (error) {  
      console.error("Error fetching data", error);
      set({ dataLogin: undefined });
      return undefined
    }
  },

  cleanLoginStore: () => {
    set({
      dataLogin: undefined,
    });
  },
});

export const useLoginStore = create<LoginState>(storeApi)
