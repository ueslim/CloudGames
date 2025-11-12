import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  error: string | null = null;
  loading = false;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(['/games']);
      },
      error: (err) => {
        const detail = (err?.error?.detail || err?.error?.message || '').toLowerCase();
        this.error = detail.includes('not registered') || detail.includes('not found') 
          ? 'Usuário não cadastrado no sistema'
          : detail.includes('password')
          ? 'Senha incorreta'
          : err?.error?.detail || err?.error?.message || 'Falha no login';
        this.loading = false;
      },
    });
  }
}
