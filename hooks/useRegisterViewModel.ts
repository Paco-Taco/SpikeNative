import { useState } from "react";

export const useRegisterViewModel = () => {
  const [role, setRole] = useState("");

  // Función para actualizar el rol
  const updateRole = (newRole) => {
    setRole(newRole);
  };

  // Puedes devolver el rol y la función para actualizarlo
  return {
    role,
    setRole: updateRole,
  };
};
