import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { HeadingComponent } from '../../../components/heading/heading.component';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductStatus } from '../models/productStatus';
import { Category } from '../models/category';
import { ProductStatusService } from '../services/status.service';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/products.service';
import { minImageCountValidator } from '../validators/min-image-count.validator';
import { AttributeDialogComponent } from '../dialogs/attribute-dialog/attribute-dialog.component';
import { CommonModule } from '@angular/common';
import {
  AttributeValue,
  DynamicAttribute,
} from '../models/form-type/attribute';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsProductResponse } from '../models/updatedProductResponse';
import { AttributesFormType } from '../models/form-type/attributes-type';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  imports: [
    MaterialModule,
    HeadingComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  providers: [ProductStatusService, CategoryService, ProductService],
})
export class EditProductComponent implements OnInit {
  title: string = 'Редагувати продукт';

  attributeForms: FormGroup[][] = [];

  form!: FormGroup;

  statuses$!: Observable<ProductStatus[]>;
  categories$!: Observable<Category[]>;

  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  readonly fb = inject(FormBuilder);
  readonly loader = inject(NgxUiLoaderService);

  readonly productStatusService = inject(ProductStatusService);
  readonly categoryService = inject(CategoryService);
  readonly productService = inject(ProductService);

  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  selectedImageId: number = 0;
  imageIds: number[] = [];

  selectedImageName: BehaviorSubject<string> = new BehaviorSubject<string>(
    'не обрано'
  );

  ngOnInit() {
    this.statuses$ = this.productStatusService.statuses$;
    this.categories$ = this.categoryService.getCategories();
    this.createForm();

    const productId = this.route.snapshot.paramMap.get('id')!;
    this.getProductById(+productId);
  }

  public createForm() {
    this.form = this.fb.group({
      product_id: [0],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      price: [null, [Validators.required]],
      stock: [null, [Validators.required]],
      category_id: [null, [Validators.required]],
      status_id: [null, [Validators.required]],
      attributes: this.fb.array([]),
      primary: [null],
      images: this.fb.array([], minImageCountValidator(1)),
    });
  }

  get images(): FormArray {
    return this.form.get('images') as FormArray;
  }

  get attributes(): FormArray {
    return this.form.get('attributes') as FormArray;
  }

  get attributeFormGroups(): FormGroup[] {
    return this.attributes.controls as FormGroup[];
  }

  public backToProducts() {
    this.router.navigate(['/admin/product-list']);
  }

  public setPrimaryImage(index: number, image?: any): void {
    this.form.patchValue({ primary: index });
    this.images.controls.forEach((control, i) => {
      control.patchValue({ isPrimary: i === index });
    });

    if (image) {
      this.selectedImageId = image.value.imageId;
      this.updateSelectedImageName(index);
    }
  }

  private updateSelectedImageName(index: number) {
    const image = this.images.at(index);
    const imageName = image
      ? `Зображення ${parseInt(index.toString(), 10) + 1}`
      : 'Будь ласка оберіть головне зображення';
    this.selectedImageName.next(imageName);
    this.form.patchValue({ primary: index });
  }

  public clear() {
    this.form.reset();
  }

  public mapValuesAttributes(array: AttributeValue[]) {
    return array.map((item) => ({
      key: item.title,
      values: item.attributeValues.map(
        (value: DynamicAttribute) => value.attributeValueTitle
      ),
    }));
  }

  public addAttributeControl(key: string, attributes: string[]) {
    const attributeForm = this.fb.group({
      attribute_id: [],
      title: [key, Validators.required],
      attributeValues: this.fb.array([]),
    });

    const attributeValuesArray = attributeForm.get(
      'attributeValues'
    ) as FormArray;
    this.attributeForms.push([]);

    attributes.forEach((attr) => {
      const valueForm = this.fb.group({
        value_id: [],
        attributeValueTitle: [attr, Validators.required],
      });
      attributeValuesArray.push(valueForm);
      this.attributeForms[this.attributeForms.length - 1].push(valueForm);
    });

    this.attributes.push(attributeForm);
  }

  public deleteAttributeControl(index: number) {
    this.attributeForms.splice(index, 1);
    this.attributes.removeAt(index);
  }

  public deleteAttributeValue(
    attributeIndex: number,
    valueIndex: number
  ): void {
    const attributeValues = this.attributes
      .at(attributeIndex)
      .get('attributeValues') as FormArray;
    if (attributeValues && attributeValues.length > valueIndex) {
      attributeValues.removeAt(valueIndex);
      this.attributeForms[attributeIndex].splice(valueIndex, 1);
    }
    if (attributeValues.length === 0) {
      this.deleteAttributeControl(attributeIndex);
    }
  }

  public addAttribute(): void {
    const dialogRef = this.dialog.open(AttributeDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const attributes = result.attributeValues.filter(
          (item: string) => !!item
        );

        this.addAttributeControl(result.key, attributes);
      }
    });
  }

  public addAttributeValue(attributeIndex: number): void {
    const attributeForm = this.attributes.at(attributeIndex) as FormGroup;
    const attributeValuesArray = attributeForm.get(
      'attributeValues'
    ) as FormArray;

    const newValueForm = this.fb.group({
      attributeValueTitle: ['', Validators.required],
    });

    attributeValuesArray.push(newValueForm);
    this.attributeForms[attributeIndex].push(newValueForm);
  }

  public deleteAttribute(lessonIndex: number) {
    this.attributes.removeAt(lessonIndex);
  }

  public onFileSelect(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let files = element.files;
    if (files) {
      Array.from(files).forEach((file) => {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.push(
            this.fb.group({
              file: [file],
              path: [e.target.result],
            })
          );
          this.updateSelectedImageName(this.images.length - 1);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  public deleteImage(index: number, image: any) {
    this.images.removeAt(index);

    if (this.images.length === 0) {
      this.form.patchValue({ primary: index });
      this.selectedImageName.next('Будь ласка, оберіть головне фото');
    } else if (this.form.value.primary >= this.images.length) {
      this.updateSelectedImageName(this.images.length - 1);
    }

    if (!!image.value.imageId) {
      this.imageIds.push(image.value.imageId);
    }
  }

  public setImages(images: any[]): void {
    const imagesFormArray = this.images as FormArray;
    if (images?.length) {
      images.forEach((image) => {
        const fullPath = `http://localhost:5500/${image.image_path}`;
        imagesFormArray.push(
          this.fb.group({
            file: [image.file],
            path: [fullPath],
            isPrimary: [image.isPrimary],
            imageId: [image.image_id],
          })
        );
      });
    }
  }

  public setAttributes(attributes: AttributesFormType[]): void {
    if (attributes?.length) {
      attributes.forEach((attr) => {
        if (attr?.values?.length) {
          const mapped = attr.values.map((item) => item.value);
          this.addAttributeControl(attr.key, mapped);
        }
      });
    }
  }

  public prefillForm(result: DetailsProductResponse) {
    this.images.clear();
    this.attributes.clear();

    this.form.controls['title'].reset(result.product.title);
    this.form.controls['price'].reset(result.product.price);
    this.form.controls['stock'].reset(result.product.stock);
    this.form.controls['status_id'].reset(result.product.status_id);
    this.form.controls['category_id'].reset(result.product.category_id);
    this.form.controls['product_id'].reset(result.product.product_id);
    if (!!result.product.attributes?.length) {
      this.setAttributes(result.product.attributes);
    }
    if (!!result.product.images?.length) {
      this.setImages(result.product?.images);

      let primaryIndex: number;

      const index = result.product.images.findIndex(
        (image) => image.is_primary === true
      );

      const restoreIndex = result.product.images.findIndex(
        (item) => item.image_id
      );

      if (index !== -1) {
        primaryIndex = index;
      } else {
        primaryIndex = restoreIndex;
      }
      this.setPrimaryImage(primaryIndex, this.images.at(primaryIndex));
    }
    this.form.updateValueAndValidity();
  }

  public getProductById(id: number) {
    this.loader.start();
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (result) => {
          this.prefillForm(result);
          this.loader.stop();
        },
        error: (error) => {
          this.loader.stop();
          console.error(error);
        },
      });
    }
  }

  public updateProduct() {
    if (!this.form.valid) {
      return;
    }
    this.loader.start();
    const formData = new FormData();

    formData.append('product_id', this.form.get('product_id')?.value);
    formData.append('title', this.form.get('title')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('price', this.form.get('price')?.value);
    formData.append('stock', this.form.get('stock')?.value);
    formData.append('category_id', this.form.get('category_id')?.value);
    formData.append('status_id', this.form.get('status_id')?.value);
    formData.append('deleteImageIds', JSON.stringify(this.imageIds));

    formData.append('selectedImageId', JSON.stringify(this.selectedImageId));

    const attributes = this.mapValuesAttributes(this.attributes.value);
    if (!!attributes?.length) {
      formData.append('attributes', JSON.stringify(attributes));
    }

    const images = this.images.controls;
    images.forEach((imageControl, index) => {
      const file = imageControl.get('file')!.value;
      if (file) {
        formData.append('images', file, file.name);
      }
    });

    this.productService
      .updateProduct(this.form.value.product_id, formData)
      .pipe(
        catchError((error) => {
          this.loader.stop();
          this.snackBar.open('Помилка при оновленні продукту', 'Закрити', {
            duration: 3000,
          });
          console.error('Помилка при оновленні продукту:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (result) => {
          this.loader.stop();
          this.imageIds = [];
          this.selectedImageId = 0;

          this.prefillForm(result);
          this.snackBar.open('Продукт оновлено', 'Закрити', {
            duration: 3000,
          });
        },
        error: (error) => {
          this.loader.stop();
          console.error('Помилка при оновлені продукту:', error);
        },
      });
  }
}
