import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-attribute-dialog',
  templateUrl: './attribute-dialog.component.html',
  styleUrls: ['./attribute-dialog.component.scss'],
  imports: [MaterialModule, ReactiveFormsModule],
})
export class AttributeDialogComponent implements OnInit {
  form!: FormGroup;
  readonly attributeValues = signal(['']);

  readonly announcer = inject(LiveAnnouncer);
  readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<AttributeDialogComponent>);

  ngOnInit(): void {
    this.createForm();
  }

  public createForm() {
    this.form = this.fb.group({
      key: ['', Validators.required],
      attributeValue: [''],
    });
  }

  public save(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        attributeValues: this.attributeValues(),
        key: this.form.value.key,
      });
    }
  }

  public add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.attributeValues.update((attributeValues) => [
        ...attributeValues,
        value,
      ]);
    }

    this.form.controls['attributeValue'].reset('');
  }

  filled = computed(() => {
    const filtered = this.attributeValues().filter((str) => str != '');
    return !!filtered.length;
  });

  public remove(fruit: string): void {
    this.attributeValues.update((attributeValues) => {
      const index = attributeValues.indexOf(fruit);
      if (index < 0) {
        return attributeValues;
      }

      attributeValues.splice(index, 1);
      return [...attributeValues];
    });
  }

  public close(): void {
    this.dialogRef.close();
  }
}
