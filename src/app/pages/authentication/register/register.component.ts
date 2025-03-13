import { Component, inject, OnInit } from '@angular/core';
import { User } from '../models/user';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [RouterLink, MaterialModule, ReactiveFormsModule],
  providers: [AuthService],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  readonly snackBar = inject(MatSnackBar);
  readonly loader = inject(NgxUiLoaderService);
  readonly router = inject(Router);

  readonly formBuilder = inject(FormBuilder);
  readonly authService = inject(AuthService);

  private createForm() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  public createAccount(): void {
    if (!this.form.valid) {
      return;
    }
    this.loader.start();
    const request: User = {
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
    };
    this.authService.register(request).subscribe({
      next: () => {
        this.loader.stop();
        this.router.navigate(['authentication/login']);
      },
      error: (error) => {
        this.loader.stop();
        console.log(error);
      },
    });
  }

  ngOnInit(): void {
    this.createForm();
  }
}
