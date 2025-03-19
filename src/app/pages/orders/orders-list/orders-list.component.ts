import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { MaterialModule } from '../../../material.module';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ViewOrder } from '../model/viewOrder';
import { OrderService } from '../services/order.service';
import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  imports: [
    CommonModule,
    HeadingComponent,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [OrderService],
})
export class OrdersListComponent implements OnInit, OnDestroy {
  title: string = 'Список замовлень';

  form!: FormGroup;

  displayedColumns: string[] = [
    'customerName',
    'email',
    'phone',
    'status',
    'totalCost',
    'actions',
  ];

  isLoaded: boolean = false;

  dataSource = new MatTableDataSource<ViewOrder>();
  private subscriptions: Subscription = new Subscription();

  readonly router = inject(Router);
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  readonly loader = inject(NgxUiLoaderService);

  readonly orderService = inject(OrderService);
  readonly webSocketService = inject(WebSocketService);

  public handleRefresh(): void {
    this.getProducts();
  }

  public viewOrder(id: number) {
    this.router.navigate(['/admin/order-details', id]);
  }

  public getProducts(): void {
    this.loader.start();
    const subscription = this.orderService
      .getOrders()
      .pipe(
        catchError((error) => {
          this.loader.stop();
          throw 'error in getting products: ' + error;
        })
      )
      .subscribe((result) => {
        this.loader.stop();
        const orders = this.orderService.mapOrders(result);
        this.dataSource.data = orders;
        if (result.length) {
          this.isLoaded = true;
        } else {
          this.isLoaded = false;
        }
      });
    this.subscriptions.add(subscription);
  }

  public handleCurrentOrder() {
    this.webSocketService.onNewOrder().subscribe((order) => {
      this.snackBar
        .open('Нове замовлення отримано! Перевірте деталі.', 'Переглянути', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })
        .onAction()
        .subscribe(() => {
          this.getProducts();
        });
    });
  }

  ngOnInit(): void {
    this.handleCurrentOrder();
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.webSocketService.disconnect();
  }
}
