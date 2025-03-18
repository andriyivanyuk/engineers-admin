import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from '../../../material.module';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { catchError, of, Subscription, switchMap } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from '../../../components/dialogs/delete/delete-dialog.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  imports: [
    CommonModule,
    HeadingComponent,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [CategoryService],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  title: string = 'Список категорій';
  displayedColumns: string[] = ['id', 'title', 'description', 'actions'];

  isLoaded: boolean = false;

  dataSource = new MatTableDataSource<Category>();

  private subscriptions: Subscription = new Subscription();

  readonly router = inject(Router);
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  readonly loader = inject(NgxUiLoaderService);
  readonly categoryService = inject(CategoryService);

  public handleRefresh() {
    this.getCategories();
  }

  public openDialog(id: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '600px',
      data: {
        deleteTitle: 'Видалити категорію',
        deleteContent:
          'Ви дійсно хочете видалити категорію?. Буде видалено також продукт який має таку категорію',
      },
    });
    const dialogSubscription = dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            this.loader.start();
            return this.categoryService.deleteCategory(id);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (result) => {
          if (result) {
            this.loader.stop();
            this.getCategories();
            this.snackBar.open(result.message, 'Закрити', {
              duration: 3000,
            });
          }
        },
        error: (error) => {
          this.loader.stop();
          this.snackBar.open(error.error.message, 'Закрити', {
            duration: 5000,
          });
        },
      });
    this.subscriptions.add(dialogSubscription);
  }

  public getCategories(): void {
    this.loader.start();
    const subscription = this.categoryService
      .getCategories()
      .pipe(
        catchError((error) => {
          this.loader.stop();
          throw 'error in getting products: ' + error;
        })
      )
      .subscribe((result) => {
        this.loader.stop();
        this.dataSource.data = result;
        if (result.length) {
          this.isLoaded = true;
        } else {
          this.isLoaded = false;
        }
      });
    this.subscriptions.add(subscription);
  }

  public editCategory(id: number) {
    this.router.navigate(['/admin/edit-category', id]);
  }

  ngOnInit(): void {
    this.getCategories();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
