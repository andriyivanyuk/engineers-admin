import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreResponse } from '../models/storeResponse';

@Injectable()
export class SettingService {
  private apiUrl = 'http://localhost:5500/api/admin';

  constructor(private http: HttpClient) {}

  public getStoreId(): Observable<StoreResponse> {
    return this.http.get<StoreResponse>(this.apiUrl + '/storeId');
  }
}
