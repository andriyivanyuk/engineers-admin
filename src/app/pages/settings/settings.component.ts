import { Component, inject, OnInit } from '@angular/core';
import { HeadingComponent } from '../../components/heading/heading.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material.module';
import { SettingService } from './services/setting.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  imports: [HeadingComponent, MaterialModule, ReactiveFormsModule],
  providers: [SettingService],
})
export class SettingsComponent implements OnInit {
  title: string = 'Налаштування';

  form!: FormGroup;

  readonly fb = inject(FormBuilder);

  isLoaded: boolean = false;
  constructor() {}

  readonly loader = inject(NgxUiLoaderService);
  readonly snackBar = inject(MatSnackBar);

  readonly settingService = inject(SettingService);

  ngOnInit() {
    this.createForm();
    this.getApiCode();
  }

  public createForm() {
    this.form = this.fb.group({
      title: [{ value: '', disabled: true }],
    });
  }

  public getApiCode(): void {
    this.loader.start();
    this.settingService.getStoreId().subscribe({
      next: (result) => {
        this.form.controls['title'].reset(result.store_id);
        this.loader.stop();
        this.isLoaded = true;
      },
      error: (error) => {
        this.loader.stop();
        this.isLoaded = true;
        console.error(error);
      },
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

  public handleRefresh(): void {
    this.getApiCode();
  }
}
