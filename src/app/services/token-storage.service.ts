import { Injectable } from '@angular/core';
import { LoginResponse } from '../pages/authentication/models/loginResponse';
import { User } from '../pages/authentication/models/user';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  isAuthenticated: boolean = false;
  private tokenKey: string = 'AUTH_TOKEN';
  private userData: string = 'USER_DATA';

  constructor() {}

  public saveToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  public clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userData);
  }

  public setUserSession(result: LoginResponse): void {
    if (result.token) {
      const data = {
        username: result.user.username,
        email: result.user.email,
        token: result.token,
        userId: result.user.user_id,
        role: result.user.role,
      };
      this.setStorageItem(this.userData, JSON.stringify(data));
      this.isAuthenticated = true;
    } else {
      console.error('User token is undefined');
      this.isAuthenticated = false;
    }
  }

  public getUserSession(): User {
    const userData = sessionStorage.getItem(this.userData);
    return JSON.parse(userData ? userData : '');
  }

  private setStorageItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }
}
