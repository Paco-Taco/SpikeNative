import { SpikeLoginService } from "@/services/spikeLoginService.service";
import { LoginRequest, LoginResponse } from "@/types/spikeLogin.types";
import { create, StateCreator } from "zustand";
import * as SecureStore from 'expo-secure-store';

import axios, { AxiosError } from "axios";

const SECURE_STORE_KEY = "dataLogin";

interface LoginState {
  dataLogin?: LoginResponse | null;
  fetchLogin: (data: LoginRequest) => Promise<LoginResponse | null>;
  cleanLoginStore: () => void;
  loadLoginFromStore: () => Promise<void>;
  updateProfile: (newProfileData: Partial<LoginResponse['user']>) => Promise<void>;
}

const storeApi: StateCreator<LoginState> = (set, get) => ({
  dataLogin: null,

  // Función para hacer login
  fetchLogin: async (body: LoginRequest) => {
    try {
      const data = await SpikeLoginService.login(body);
      set({ dataLogin: data });

      // Guarda el login data en SecureStore
      await SecureStore.setItemAsync(SECURE_STORE_KEY, JSON.stringify(data));
      return data;
    } catch (error) {  
      set({ dataLogin: null });
      console.log(error)
      throw error
    }
  },

  // Función para limpiar los datos de login
  cleanLoginStore: async () => {
    set({ dataLogin: null });
    
    // Elimina el login data del SecureStore
    await SecureStore.deleteItemAsync(SECURE_STORE_KEY);
  },

  // Función para cargar los datos de login desde SecureStore
  loadLoginFromStore: async () => {
    try {
      const storedData = await SecureStore.getItemAsync(SECURE_STORE_KEY);
      if (storedData) {
        set({ dataLogin: JSON.parse(storedData) });
      }
    } catch (error) {
      console.error("Error loading login data from SecureStore", error);
    }
  },

  // Función para actualizar el perfil
  updateProfile: async (newProfileData) => {
    const currentData = get().dataLogin;
    if (!currentData) return;

    const updatedData = { 
      ...currentData,
      user: {
        ...currentData.user,
        ...newProfileData,  
      }
    };

    set({ dataLogin: updatedData });

    // Guarda los nuevos datos actualizados en SecureStore
    await SecureStore.setItemAsync(SECURE_STORE_KEY, JSON.stringify(updatedData));
  }
});

// Inicializa el store y carga los datos de SecureStore
const useLoginStore = create<LoginState>(storeApi);

useLoginStore.getState().loadLoginFromStore();

export { useLoginStore };
