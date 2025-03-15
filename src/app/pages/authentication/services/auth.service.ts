import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/loginResponse';
import { LoginRequest } from '../models/loginRequest';
import { RegisterResponse } from '../models/registerResponse';
import { AccountRequest } from '../models/accountRequest';

@Injectable()
export class AuthService {
  private apiUrl = 'http://localhost:5500/api/auth/admin';

  constructor(private http: HttpClient) {}

  public login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<any>(`${this.apiUrl}/login`, request);
  }

  public register(user: AccountRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, user);
  }

  public verifyEmail(token: string): Observable<any> {
    return this.http.get(this.apiUrl + '/verify/' + token);
  }

  public isLoggedIn(): boolean {
    const token = localStorage.getItem('AUTH_TOKEN');
    return !!token;
  }
}
