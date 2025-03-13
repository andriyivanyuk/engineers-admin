import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-verify',
  imports: [ReactiveFormsModule],
  providers: [AuthService],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss',
})
export class VerifyComponent implements OnInit {
  message: string = 'Verifying...';

  readonly loader = inject(NgxUiLoaderService);
  readonly authService = inject(AuthService);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loader.start();
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: () => {
          this.message =
            'Email verification successful! Your email has been verified.';
          this.loader.stop();
        },
        error: (error) => {
          this.message = `Verification failed: ${error.error.message}`;
          this.loader.stop();
        },
      });
    } else {
      this.message = 'Verification failed: No token provided.';
    }
  }
}
