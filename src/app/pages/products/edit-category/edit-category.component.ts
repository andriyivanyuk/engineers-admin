import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { HeadingComponent } from '../../../components/heading/heading.component';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductStatusService } from '../services/status.service';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/products.service';
import { CommonModule } from '@angular/common';
import { UpdateCategory } from '../models/updateCategory';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
  imports: [
    MaterialModule,
    HeadingComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  providers: [ProductStatusService, CategoryService, ProductService],
})
export class EditCategoryComponent implements OnInit {
  title: string = 'Змінити категорію';

  form!: FormGroup;
  isLoaded: boolean = false;

  readonly snackBar = inject(MatSnackBar);
  readonly loader = inject(NgxUiLoaderService);
  readonly formBuilder = inject(FormBuilder);

  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  readonly categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.createForm();
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id) {
      this.prefillForm(+id);
    }
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      category_id: [null],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
    });
  }

  public backToCategories(): void {
    this.router.navigate(['/admin/category-list']);
  }

  public prefillForm(id: number): void {
    if (id) {
      this.loader.start();
      this.categoryService.getCategoryById(id).subscribe({
        next: (result) => {
          this.isLoaded = true;
          this.loader.stop();
          this.form.reset(result);
        },
        error: (error) => {
          this.loader.stop();
          console.error(error);
        },
      });
    }
  }

  public updateCategory(): void {
    if (this.form.invalid) {
      return;
    }

    this.loader.start();

    const request: UpdateCategory = {
      id: this.form.value.category_id,
      category: {
        title: this.form.value.title,
        description: this.form.value.description,
      },
    };
    this.categoryService.updateCategory(request).subscribe({
      next: (result) => {
        this.loader.stop();
        this.snackBar.open('Категорію оновлено', 'Закрити', {
          duration: 3000,
        });
        this.form.reset(result);
      },
      error: (error) => {
        this.loader.stop();
      },
    });
  }
}
