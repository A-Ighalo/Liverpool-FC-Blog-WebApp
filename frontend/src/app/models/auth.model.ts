export interface User {
  id?: number;
  username: string;
  email: string;
  roles: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  accessToken: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface MessageResponse {
  message: string;
}