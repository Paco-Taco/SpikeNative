export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  city: string;
  number_int: string;
  cp: string;
  img: string;
  img_public_id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ErrorResponse {
  error: boolean;
  message: any;
}
