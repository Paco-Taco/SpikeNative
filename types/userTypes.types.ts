export interface GetVeterinariesResponse {
  veterinaries: Veterinary[];
}

export interface Veterinary {
  id: number;
  veterinarieName: string;
  street: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  city: string;
  locality: string;
  cologne: string;
  number_int: string;
  cp: string;
  rfc: string;
  category: string[];
  daysOfWeek: string[];
  img: string;
  img_public_id: null | string;
  createdAt: Date;
  updatedAt: Date;
  hora_ini: string;
  hora_fin: string;
}

// types/userTypes.types.ts

export interface ResponseEditVet {
  success: boolean;
  message: string;
  data: {
    id: number;
    veterinarieName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    locality: string;
    cologne: string;
    number_int: string;
    cp: string;
    rfc: string;
    category: string[];
    img: string;
    img_public_id: string | null;
    createdAt: string;
    updatedAt: string;
  };
}
