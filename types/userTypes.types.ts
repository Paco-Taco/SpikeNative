export interface GetVeterinariesRequest {
  token: string | null | undefined;
}

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
  img: string;
  img_public_id: null | string;
  createdAt: Date;
  updatedAt: Date;
}
