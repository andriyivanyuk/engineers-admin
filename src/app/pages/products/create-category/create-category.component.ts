import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { HeadingComponent } from '../../../components/heading/heading.component';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductStatusService } from '../services/status.service';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
  imports: [
    MaterialModule,
    HeadingComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [ProductStatusService, CategoryService, ProductService],
})
export class CreateCategoryComponent implements OnInit {
  title: string = 'Створити категорію';

  form!: FormGroup;

  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  readonly fb = inject(FormBuilder);
  readonly loader = inject(NgxUiLoaderService);

  readonly productStatusService = inject(ProductStatusService);
  readonly categoryService = inject(CategoryService);
  readonly productService = inject(ProductService);

  ngOnInit() {
    this.createForm();
  }

  public createForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
    });
  }

  public clear() {
    this.form.reset();
  }

  public createCategory() {
    if (this.form.invalid) {
      return;
    }
    this.loader.start();
    const request: any = {
      title: this.form.value.title,
      description: this.form.value.description,
    };
    this.categoryService.createCategory(request).subscribe({
      next: () => {
        this.loader.stop();
        this.snackBar.open('Категорію додано', 'Закрити', {
          duration: 3000,
        });
        this.form.reset();
      },
      error: (error) => {
        this.loader.stop();
        console.log(error);
      },
    });
  }
}
