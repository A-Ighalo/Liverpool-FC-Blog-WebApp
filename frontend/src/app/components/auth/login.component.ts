import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (this.username && this.password) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid username or password';
          this.isLoading = false;
        }
      });
    }
  }
}