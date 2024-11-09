import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { ResponseEditVet } from "@/types/userTypes.types";
import { AxiosError } from "axios";

export class UpdateService {
    static updateVetProfile = async (
      userId: number,
      formData: FormData,
      token: string
    ): Promise<ResponseEditVet> => {
      try {
        const { data } = await axiosInstanceSpikeCore.post<ResponseEditVet>(
          `/updateUser/${userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return data;
      } catch (error) {
        console.error("Error al actualizar perfil:", error);
        if (error instanceof AxiosError) {
          throw new Error(`Error en la solicitud: ${error.response?.data?.message || error.message}`);
        }
        throw new Error("UpdateService: No se pudo actualizar el perfil del veterinario");
      }
    };
  }
  