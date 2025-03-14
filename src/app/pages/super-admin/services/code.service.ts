import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Observable } from 'rxjs';
import { Code } from '../models/code';
import { RegistrationCode } from '../models/registrationCode';

@Injectable()
export class CodeService {
  private apiUrl = 'http://localhost:5500/api/super';

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenStorage.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  public generateCode(): Observable<Code> {
    return this.http.post<Code>(
      `${this.apiUrl}/registration-codes/generate`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  public listCodes(): Observable<RegistrationCode[]> {
    return this.http.get<RegistrationCode[]>(
      `${this.apiUrl}/registration-codes`,
      { headers: this.getAuthHeaders() }
    );
  }
}
