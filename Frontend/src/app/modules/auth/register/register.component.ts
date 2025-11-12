import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../../shared/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  error: string | null = null;
  success: string | null = null;
  loading = false;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(private fb: FormBuilder, private users: UsersService, private router: Router) {}

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.success = null;
    this.users.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.success = 'Conta criada com sucesso! Redirecionando para o login...';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        const detail = (err?.error?.detail || err?.error?.message || '').toLowerCase();
        this.error = detail.includes('already in use')
          ? 'Este email já está cadastrado no sistema'
          : err?.error?.detail || err?.error?.message || 'Falha no registro';
        this.loading = false;
      },
    });
  }
}


