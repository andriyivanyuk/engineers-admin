import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MaterialModule } from '../../../material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ProductService } from '../services/products.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Subscription,
} from 'rxjs';
import { ViewProduct } from '../models/viewProduct';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  imports: [
    HeadingComponent,
    MatPaginator,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [ProductService],
})
export class ProductListComponent implements OnInit, OnDestroy {
  title: string = 'Список продуктів';
  form!: FormGroup;

  private subscriptions: Subscription = new Subscription();

  displayedColumns: string[] = [
    'title',
    'amount',
    'status',
    'price',
    'actions',
  ];
  dataSource!: MatTableDataSource<ViewProduct>;

  //For pagination
  totalProducts = 0;
  page = 1;
  limit = 20;

  isLoaded: boolean = false;
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly router = inject(Router);
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  readonly loader = inject(NgxUiLoaderService);
  readonly fb = inject(FormBuilder);

  readonly productService = inject(ProductService);

  public createForm(): void {
    this.form = this.fb.group({
      title: [''],
    });
  }

  public handleSearchByTitle(): void {
    this.form.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.page = 1;
        if (value) {
          this.getProducts(value.title);
          this.isLoading = true;
        }
      });
  }

  public getProducts(value: string = ''): void {
    this.loader.start();
    const subscription = this.productService
      .getProducts(this.page, this.limit, value)
      .pipe(
        catchError((error) => {
          this.loader.stop();
          this.isLoaded = false;
          throw 'error in getting products: ' + error;
        })
      )
      .subscribe((result) => {
        this.loader.stop();

        this.isLoading = false;

        const products = this.productService.mapProducts(result.products);
        this.dataSource = new MatTableDataSource(products);
        this.totalProducts = products.length;
        if (result.products.length) {
          this.isLoaded = true;
        } else {
          this.isLoaded = false;
        }
      });
    this.subscriptions.add(subscription);
  }

  public onPageEvent(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getProducts();
  }

  public handleRefresh(): void {
    this.getProducts();
  }

  ngOnInit() {
    this.createForm();
    this.handleSearchByTitle();
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
