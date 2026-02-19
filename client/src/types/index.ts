export interface User {
  id: number;
  name: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: 'CLIENT' | 'PROVIDER';
}
