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
      if (error instanceof AxiosError) {
        console.log("LoginService: ", error.message);
        throw new Error("LoginService: Unable to login");
      }
      console.log(error);
      throw new Error("LoginService: Unable to login");
    }
  };
}
