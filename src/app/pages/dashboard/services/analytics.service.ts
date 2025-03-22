import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderAnalytics } from '../models/orderAnalytics';
import { IncomeAnalytics } from '../models/incomeAnalytics';

@Injectable()
export class OrderAnalyticsService {
  private apiUrl = 'http://localhost:5500/api/admin/order';

  constructor(private http: HttpClient) {}

  public getOrdersAnalytics(): Observable<OrderAnalytics> {
    return this.http.get<OrderAnalytics>(`${this.apiUrl}/analytics`);
  }

  public getIncomeAnalytics(): Observable<IncomeAnalytics> {
    return this.http.get<IncomeAnalytics>(`${this.apiUrl}/income`);
  }
}
