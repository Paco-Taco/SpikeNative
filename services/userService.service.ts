import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { LoginRequest, LoginResponse } from "@/types/spikeLogin.types";
import { GetVeterinariesRequest, GetVeterinariesResponse } from "@/types/userTypes.types";
import { AxiosError } from "axios";

export class UserService {
  static getVeterinaries = async (body: GetVeterinariesRequest): Promise<GetVeterinariesResponse> => {
    try {
      const { data } = await axiosInstanceSpikeCore.post<GetVeterinariesResponse>(
        "/getveterinaries",
        body
      );

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
