import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { LoginRequest, LoginResponse } from "@/types/spikeLogin.types";
import { AxiosError } from "axios";

export class SpikeLoginService {
  static login = async (body: LoginRequest): Promise<LoginResponse> => {
    try {
      const { data } = await axiosInstanceSpikeCore.post<LoginResponse>(
        "/login",
        body
      );

      return data;
    } catch (error) {
      console.log(error);
      throw new Error("LoginService: Unable to login");
    }
  };
}
