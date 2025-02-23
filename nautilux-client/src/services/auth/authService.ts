import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/utils/auth";

class AuthService {
  private async handleAuthResponse(response: Response): Promise<AuthResponse> {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Authentication failed');
    }
    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify(credentials),
    });
    return this.handleAuthResponse(response);
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    return this.handleAuthResponse(response);
  }

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    return this.handleAuthResponse(response);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.user;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();
