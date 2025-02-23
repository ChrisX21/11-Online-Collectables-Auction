export interface User {
  id: string;
  email: string;
  userName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  userName: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}
