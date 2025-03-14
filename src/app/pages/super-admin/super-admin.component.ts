import { Component, inject, OnInit } from '@angular/core';
import { HeadingComponent } from '../../components/heading/heading.component';
import { CodeService } from './services/code.service';
import { MaterialModule } from '../../material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss'],
  imports: [HeadingComponent, MaterialModule, ReactiveFormsModule],
  providers: [CodeService],
})
export class SuperAdminComponent implements OnInit {
  title: string = 'Генерація коду';

  form!: FormGroup;

  readonly fb = inject(FormBuilder);
  readonly snackBar = inject(MatSnackBar);

  readonly codeService = inject(CodeService);

  ngOnInit() {
    this.createForm();
  }

  public createForm() {
    this.form = this.fb.group({
      title: [{ value: '', disabled: true }],
    });
  }

  public copyCode(): void {
    const code = this.form.get('title')?.value;
    if (code) {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          this.snackBar.open('Код скопійовано!', '', { duration: 2000 });
        })
        .catch((err) => {
          console.error('Помилка копіювання: ', err);
          this.snackBar.open('Не вдалося скопіювати код.', '', {
            duration: 2000,
          });
        });
    } else {
      this.snackBar.open('Немає коду для копіювання.', '', { duration: 2000 });
    }
  }

  public generateCode() {
    this.codeService.generateCode().subscribe({
      next: (result) => {
        this.form.controls['title'].reset(result.code);
      },
      error: (error) => {
        this.snackBar.open(error.error, 'Закрити', {
          duration: 5000,
        });
      },
    });
  }
}
