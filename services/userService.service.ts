import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { LoginRequest, LoginResponse } from "@/types/spikeLogin.types";
import { GetVeterinariesResponse } from "@/types/userTypes.types";
import axios, { AxiosError } from "axios";

export class UserService {
  static getVeterinaries = async (): Promise<GetVeterinariesResponse> => {
    try {
      const { data } = await axiosInstanceSpikeCore.post<GetVeterinariesResponse>(
        "/getVeterinaries",
      )
      
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error;
        console.error("Detalles del error:", error.response?.data);
        throw errorMessage;
      }
      console.log(error);
    throw new Error("An unexpected error occurred");
    }
  };
  
}
