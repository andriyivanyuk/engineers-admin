import { Component, inject, OnInit } from '@angular/core';
import { HeadingComponent } from '../../components/heading/heading.component';
import { OrderAnalyticsService } from './services/analytics.service';
import { OrderAnalytics } from './models/orderAnalytics';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { IncomeAnalytics } from './models/incomeAnalytics';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [HeadingComponent, MaterialModule, CommonModule],
  providers: [OrderAnalyticsService],
})
export class DashboardComponent implements OnInit {
  title: string = 'Аналітика';

  orderAnalytics: OrderAnalytics | null = null;
  incomeAnalytics: IncomeAnalytics | null = null;
  loading: boolean = false;

  readonly orderAnalyticsService = inject(OrderAnalyticsService);

  ngOnInit() {
    this.handleOrderAnalytics();
    this.handleIncomeAnalytics();
  }

  public handleOrderAnalytics(): void {
    this.orderAnalyticsService.getOrdersAnalytics().subscribe({
      next: (result) => {
        this.orderAnalytics = result;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  public handleIncomeAnalytics(): void {
    this.loading = true;
    this.orderAnalyticsService.getIncomeAnalytics().subscribe({
      next: (result) => {
        this.incomeAnalytics = result;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
}
