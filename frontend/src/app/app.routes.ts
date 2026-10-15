import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'blog', loadComponent: () => import('./components/blog/blog-list.component').then(m => m.BlogListComponent) },
  { path: 'blog/:id', loadComponent: () => import('./components/blog/blog-detail.component').then(m => m.BlogDetailComponent) },
  { path: 'news', loadComponent: () => import('./components/news/news.component').then(m => m.NewsComponent) },
  { path: 'fixtures', loadComponent: () => import('./components/fixtures/fixtures.component').then(m => m.FixturesComponent) },
  { path: 'table', loadComponent: () => import('./components/table/table.component').then(m => m.TableComponent) },
  { path: 'squad', loadComponent: () => import('./components/squad/squad.component').then(m => m.SquadComponent) },
  { path: 'stats', loadComponent: () => import('./components/stats/stats.component').then(m => m.StatsComponent) },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: '' }
];
