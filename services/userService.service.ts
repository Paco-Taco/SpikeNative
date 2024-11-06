import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { LoginRequest, LoginResponse } from "@/types/spikeLogin.types";
import { GetVeterinariesResponse } from "@/types/userTypes.types";
import axios, { AxiosError } from "axios";

axiosInstanceSpikeCore.interceptors.request.use(request => {
  console.log("Headers enviados:", request.headers);
  return request;
});
export class UserService {
  static getVeterinaries = async (): Promise<GetVeterinariesResponse> => {
    try {
      const { data } = await axiosInstanceSpikeCore.post<GetVeterinariesResponse>(
        "/getVeterinaries",
      )
      
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('GetVets E:', error.message);
        throw new Error("Error: getvets");
      }
      console.log(error);
      throw new Error("Error: getvets");
    }
  };
}
