import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <h1>🔧 Admin Dashboard</h1>
        <p>Manage Liverpool FC content and statistics</p>
      </header>

      <div class="admin-content">
        <div class="admin-cards">
          <div class="admin-card">
            <div class="card-icon">📝</div>
            <h3>Blog Management</h3>
            <p>Create, edit, and publish blog posts</p>
            <button class="btn btn-primary" (click)="manageBlog()">Manage Posts</button>
          </div>

          <div class="admin-card">
            <div class="card-icon">📊</div>
            <h3>Player Statistics</h3>
            <p>Update player stats and performance data</p>
            <button class="btn btn-primary" (click)="manageStats()">Manage Stats</button>
          </div>

          <div class="admin-card">
            <div class="card-icon">⚽</div>
            <h3>Fixtures</h3>
            <p>Add and update match fixtures and results</p>
            <button class="btn btn-primary" (click)="manageFixtures()">Manage Fixtures</button>
          </div>

          <div class="admin-card">
            <div class="card-icon">👥</div>
            <h3>User Management</h3>
            <p>Manage user accounts and permissions</p>
            <button class="btn btn-primary" (click)="manageUsers()">Manage Users</button>
          </div>
        </div>

        <div class="admin-info">
          <h3>Welcome, Admin!</h3>
          <p>You have administrative access to manage the Liverpool FC Hub content.</p>
          <p><strong>Note:</strong> This is a simplified admin interface. In a production environment, 
          you would have detailed forms and management tools for each section.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .admin-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .admin-header h1 {
      color: #C8102E;
      font-size: 3rem;
      margin-bottom: 10px;
    }

    .admin-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }

    .admin-card {
      background: white;
      border-radius: 10px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .admin-card:hover {
      transform: translateY(-5px);
    }

    .card-icon {
      font-size: 3rem;
      margin-bottom: 20px;
    }

    .admin-card h3 {
      color: #00263E;
      margin-bottom: 15px;
      font-size: 1.5rem;
    }

    .admin-card p {
      color: #666;
      margin-bottom: 25px;
      line-height: 1.6;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #C8102E;
      color: white;
    }

    .btn-primary:hover {
      background: #a60e26;
      transform: translateY(-2px);
    }

    .admin-info {
      background: #f8f9fa;
      border-left: 4px solid #C8102E;
      padding: 30px;
      border-radius: 0 10px 10px 0;
    }

    .admin-info h3 {
      color: #00263E;
      margin-bottom: 15px;
    }

    .admin-info p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 10px;
    }

    @media (max-width: 768px) {
      .admin-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminComponent {
  constructor(private authService: AuthService) {}

  manageBlog(): void {
    alert('Blog management interface would open here. In a full implementation, this would navigate to a blog management component with CRUD operations.');
  }

  manageStats(): void {
    alert('Player statistics management interface would open here. Admins could add/edit player stats, seasons, and performance data.');
  }

  manageFixtures(): void {
    alert('Fixtures management interface would open here. Admins could add matches, update scores, and manage competition data.');
  }

  manageUsers(): void {
    alert('User management interface would open here. Admins could manage user roles, permissions, and account status.');
  }
}