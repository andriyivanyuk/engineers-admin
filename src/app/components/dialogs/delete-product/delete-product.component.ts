import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.scss'],
  imports: [MaterialModule],
})
export class DeleteProductComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DeleteProductComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly animal = model(this.data.animal);

  onNoClick(): void {
    this.dialogRef.close();
  }
  constructor() {}

  ngOnInit() {}
}
