import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { LoginRequest, LoginResponse } from "@/types/spikeLogin.types";
import axios, { AxiosError } from "axios";

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
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message
        console.error("Detalles del error:", error.response?.data);
        throw errorMessage;
      }

      throw new Error(
        "LoginService: Couldn't login due to an unexpected error."
      );
    }
  };
}
