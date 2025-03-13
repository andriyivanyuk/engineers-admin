import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { LoginRequest } from '../models/loginRequest';
import { MaterialModule } from '../../../material.module';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, MaterialModule],
  providers: [TokenStorageService, AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  readonly loader = inject(NgxUiLoaderService);
  readonly snackBar = inject(MatSnackBar);

  readonly router = inject(Router);

  readonly formBuilder = inject(FormBuilder);
  readonly authService = inject(AuthService);
  readonly tokenStorage = inject(TokenStorageService);

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  public signIn() {
    if (!this.form.valid) {
      return;
    }
    this.loader.start();
    const request: LoginRequest = {
      email: this.form.value.email,
      password: this.form.value.password,
    };
    this.authService.login(request).subscribe({
      next: (result) => {
        this.loader.stop();
        this.router.navigate(['admin/dashboard']);
        this.tokenStorage.saveToken(result.token);
        this.tokenStorage.setUserSession(result);
      },
      error: (error) => {
        this.loader.stop();
        this.snackBar.open(error.error, 'Close', {
          duration: 4000,
        });
      },
    });
  }
}
