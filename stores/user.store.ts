import { SpikeLoginService } from "@/services/spikeLoginService.service";
import { UserService } from "@/services/userService.service";
import {
  GetVeterinariesResponse,
} from "@/types/userTypes.types";
import { create, StateCreator } from "zustand";

interface UserStoreState {
  veterinariesList: GetVeterinariesResponse;
  getVets: () => Promise<GetVeterinariesResponse | undefined>;
  cleanLoginStore: () => void;
}

const storeApi: StateCreator<UserStoreState> = (set, get) => ({
  veterinariesList: { veterinaries: [] },

  getVets: async () => {
    try {
      const data = await UserService.getVeterinaries();
      set({ veterinariesList: data });

      return data;
    } catch (error) {
      console.error("Error fetching veterinaries", error);
      set({ veterinariesList: { veterinaries: [] } });
      return undefined;
    }
  },

  cleanLoginStore: () => {
    set({
      veterinariesList: { veterinaries: [] },
    });
  },
});

export const useUserStore = create<UserStoreState>(storeApi);
