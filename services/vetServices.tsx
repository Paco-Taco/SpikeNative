import { axiosInstanceSpikeCore } from "@/controllers/SpikeApiCore";
import { ResponseEditVet } from "@/types/userTypes.types";
import axios, { AxiosError } from "axios";

export class VeterinaryService {
  static updateVeterinary = async (
    userId: number,
    formData: FormData,
    token: string
  ): Promise<ResponseEditVet> => {
    try {
      const { data } = await axiosInstanceSpikeCore.post<ResponseEditVet>(
        `/updateVeterinary/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      // Lógica candidata para manejo de erroes personalizados del servidor

      console.error("Error al actualizar perfil del veterinario:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        console.error("Detalles del error:", error.response?.data);
        throw errorMessage;
      }
      throw new Error(
        "VeterinaryService: No se pudo actualizar el perfil de la veterinaria."
      );
    }
  };

  static createVeterinary = async (formData: FormData): Promise<any> => {
    try {
      const { data } = await axiosInstanceSpikeCore.post(
        "/createVeterinary",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    } catch (error) {
      console.error("Error al registrar la veterinaria:", error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Detalles del error:", error.response?.data);
        throw new Error(`Error en la solicitud: ${errorMessage}`);
      }
      throw new Error(
        "VeterinaryService: No se pudo completar el registro de la veterinaria."
      );
    }
  };

  // Obtener citas
  static getCitasVet = async (vetId: number): Promise<any> => {
    try {
      const { data } = await axiosInstanceSpikeCore.post("/citasVet", {
        vetId,
      });
      return data;
    } catch (error) {
      console.error("Error al obtener las citas de la veterinaria:", error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("Detalles del error:", error.response?.data);
        throw new Error(`Error en la solicitud: ${errorMessage}`);
      }
      throw new Error(
        "VeterinaryService: No se pudo obtener las citas de la veterinaria."
      );
    }
  };

  // Cancelar cita
  static cancelarCita = async (appointmentId: number) => {
    try {
      const { data } = await axiosInstanceSpikeCore.post(`/cancelarCita`, {
        appointmentId,
      });
      return data;
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Error en la solicitud: ${errorMessage}`);
      }
      throw new Error("VeterinaryService: No se pudo cancelar la cita.");
    }
  };

  // Marcar cita como completada
  static marcarCitaCompletada = async (appointmentId: number) => {
    try {
      const { data } = await axiosInstanceSpikeCore.post(`/citaCompletada`, {
        appointmentId,
      });
      return data;
    } catch (error) {
      console.error("Error al marcar la cita como completada:", error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Error en la solicitud: ${errorMessage}`);
      }
      throw new Error("VeterinaryService: No se pudo completar la cita.");
    }
  };
}
