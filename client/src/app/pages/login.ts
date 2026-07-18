import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-card">
      <h2>Login to Binaried</h2>
      <p class="subtitle">Welcome back! Please enter your details.</p>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
        <!-- Error Message -->
        <div *ngIf="errorMessage()" class="alert alert-error">
          {{ errorMessage() }}
        </div>

        <!-- Email Field -->
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            placeholder="you@example.com"
            [class.invalid]="isFieldInvalid('email')"
          />
          <div *ngIf="isFieldInvalid('email')" class="error-msg">
            <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required.</span>
            <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email.</span>
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            placeholder="••••••••"
            [class.invalid]="isFieldInvalid('password')"
          />
          <div *ngIf="isFieldInvalid('password')" class="error-msg">
            <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required.</span>
            <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters.</span>
          </div>
        </div>

        <!-- Submit Button -->
        <button type="submit" [disabled]="loginForm.invalid || isLoading()" class="btn-submit">
          {{ isLoading() ? 'Logging in...' : 'Sign In' }}
        </button>

        <p class="auth-footer">
          Don't have an account? <a routerLink="/register">Register</a>
        </p>
      </form>
    </div>
  `,
  styles: [`
    .auth-card {
      max-width: 420px;
      margin: 4rem auto;
      padding: 3rem 2.5rem;
      background: #111827;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }
    h2 {
      font-size: 2rem;
      font-weight: 800;
      text-align: center;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }
    .subtitle {
      color: #94a3b8;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    label {
      color: #cbd5e1;
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0.01em;
    }
    input {
      background: #1f2937;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 0.8rem 1rem;
      color: #f8fafc;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }
    input:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }
    input.invalid {
      border-color: #ef4444;
    }
    input.invalid:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
    }
    .error-msg {
      color: #f87171;
      font-size: 0.775rem;
      font-weight: 500;
    }
    .alert {
      padding: 0.8rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .alert-error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #f87171;
    }
    .btn-submit {
      background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
      color: white;
      padding: 0.9rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
      margin-top: 0.5rem;
    }
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      box-shadow: none;
    }
    .auth-footer {
      color: #94a3b8;
      text-align: center;
      font-size: 0.9rem;
      margin-top: 1rem;
    }
    .auth-footer a {
      color: #6366f1;
      text-decoration: none;
      font-weight: 600;
    }
    .auth-footer a:hover {
      text-decoration: underline;
    }
    @media (max-width: 480px) {
      .auth-card {
        padding: 2rem 1.5rem;
        margin: 2rem 1rem;
      }
      h2 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.error || 'Login failed. Please check your credentials.');
        }
      });
    }
  }
}
