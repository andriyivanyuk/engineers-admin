import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';

import { MatDialog } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { OrderService } from '../services/order.service';
import { Order, OrderItem, TableOrder } from '../model/order';
import { Observable } from 'rxjs';
import { UpdateOrderStatus } from '../model/updateOrderRequest';
import { MaterialModule } from '../../../material.module';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    HeadingComponent,
  ],
  providers: [OrderService],
})
export class OrderDetailsComponent implements OnInit {
  title: string = 'Деталі замовлення';

  dataSource = new MatTableDataSource<TableOrder>();
  displayedColumns: string[] = ['title', 'total', 'image'];

  statusControl = new FormControl<number>(0, [Validators.required]);
  form!: FormGroup;
  orderId!: number;

  orderStatuses$!: Observable<any[]>;

  readonly fb = inject(FormBuilder);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly clipboard = inject(Clipboard);
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);

  readonly orderService = inject(OrderService);

  readonly loader = inject(NgxUiLoaderService);

  get orderedItems(): FormArray {
    return this.form.get('orderedItems') as FormArray;
  }

  ngOnInit(): void {
    this.createForm();

    const orderId = this.route.snapshot.paramMap.get('orderId')!;
    if (orderId) {
      this.getOrderById(+orderId);
    }
    this.orderStatuses$ = this.orderService.orderStatuses$;
  }

  public createForm(): void {
    this.form = this.fb.group({
      firstName: [''],
      email: [''],
      phone: [''],
      totalCost: [''],
      city: [''],
      departmentNumber: [''],
      orderedItems: this.fb.array([]),
    });
  }

  public copyValue(value: string): void {
    this.clipboard.copy(value);
    this.snackBar.open('Скопійовано!', 'Закрити', { duration: 2000 });
  }

  public prefillForm(order: Order): void {
    this.form.controls['firstName'].reset(order.customer_name);
    this.form.controls['email'].reset(order.email);
    this.form.controls['phone'].reset(order.phone);
    this.form.controls['phone'].reset(order.phone);
    this.form.controls['city'].reset(order.city);
    this.form.controls['departmentNumber'].reset(order.departmentNumber);
    this.form.controls['totalCost'].reset(order.total_cost);

    if (!!order.items.length) {
      this.setItems(order?.items);
    }

    if (order.items) {
      const orders: TableOrder[] = order.items.map((item) => {
        const fullPath = `http://localhost:5500/${item.image_path}`;
        return {
          title: item.title,
          price: item.price,
          image_path: fullPath,
          quantity: item.quantity,
        };
      });

      this.dataSource.data = orders;
    }

    this.statusControl.reset(order.status_id);
  }

  public setItems(order: OrderItem[]): void {
    const imagesFormArray = this.orderedItems as FormArray;
    if (order?.length) {
      order.forEach((order) => {
        const fullPath = `http://localhost:5500/${order.image_path}`;
        imagesFormArray.push(
          this.fb.group({
            path: [fullPath],
            title: [order.title],
            price: [order.price],
          })
        );
      });
    }
  }

  public backToOrders(): void {
    this.router.navigate(['/admin/order-list']);
  }

  public getOrderById(id: number) {
    this.loader.start();
    this.orderService.getOrderDetails(id).subscribe({
      next: (order) => {
        this.orderId = order.order_id;
        this.prefillForm(order);
        this.loader.stop();
        this.form.disable();
      },
      error: (error) => {
        this.loader.stop();
        console.error(error);
      },
    });
  }

  public updateOrder(): void {
    if (this.orderId && this.statusControl.value) {
      this.loader.start();
      const request: UpdateOrderStatus = {
        orderId: this.orderId,
        statusId: this.statusControl.value,
      };
      this.orderService.updateOrderStatus(request).subscribe({
        next: (result) => {
          this.loader.stop();
        },
        error: (error) => {
          this.loader.stop();
        },
      });
    }
  }
}
