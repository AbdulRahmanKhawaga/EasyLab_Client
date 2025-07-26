import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login({ email: email!, password: password! }).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.access_token);
          this.toastr.success('Login successful!', 'Welcome'); // ✅ success toast
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.toastr.error('Invalid email or password.', 'Login Failed'); // ❌ error toast
        }
      });
    }
  }
}
