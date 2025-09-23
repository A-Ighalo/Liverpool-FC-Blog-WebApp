import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogPost, BlogPostPage } from '../../models/blog.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="blog-container">
      <header class="blog-header">
        <h1>Liverpool FC Blog</h1>
        <p>Latest news and updates from Anfield</p>
      </header>

      <div class="blog-content" *ngIf="!loading">
        <div class="posts-grid" *ngIf="posts.length > 0; else noPosts">
          <article class="post-card" *ngFor="let post of posts">
            <div class="post-image" *ngIf="post.imageUrl">
              <img [src]="post.imageUrl" [alt]="post.title" />
            </div>
            <div class="post-content">
              <h2>{{ post.title }}</h2>
              <p class="post-summary">{{ post.summary }}</p>
              <div class="post-meta">
                <span>{{ formatDate(post.publishedAt) }}</span>
                <span *ngIf="post.author">by {{ post.author.username }}</span>
              </div>
              <a [routerLink]="['/blog', post.id]" class="read-more">Read Full Article →</a>
            </div>
          </article>
        </div>
        
        <ng-template #noPosts>
          <div class="no-posts">
            <h3>No blog posts available</h3>
            <p>Check back later for the latest Liverpool FC news!</p>
          </div>
        </ng-template>

        <div class="pagination" *ngIf="totalPages > 1">
          <button (click)="loadPage(currentPage - 1)" [disabled]="currentPage === 0" class="btn btn-outline">
            Previous
          </button>
          <span class="page-info">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
          <button (click)="loadPage(currentPage + 1)" [disabled]="currentPage === totalPages - 1" class="btn btn-outline">
            Next
          </button>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Loading blog posts...</p>
      </div>
    </div>
  `,
  styles: [`
    .blog-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .blog-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .blog-header h1 {
      color: #C8102E;
      font-size: 3rem;
      margin-bottom: 10px;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 30px;
    }

    .post-card {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .post-card:hover {
      transform: translateY(-5px);
    }

    .post-image img {
      width: 100%;
      height: 250px;
      object-fit: cover;
    }

    .post-content {
      padding: 25px;
    }

    .post-content h2 {
      color: #00263E;
      margin-bottom: 15px;
      font-size: 1.5rem;
    }

    .post-summary {
      color: #666;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .post-meta {
      font-size: 0.9rem;
      color: #999;
      margin-bottom: 20px;
    }

    .read-more {
      color: #C8102E;
      text-decoration: none;
      font-weight: 600;
    }

    .read-more:hover {
      text-decoration: underline;
    }

    .no-posts {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 40px;
    }

    .btn {
      padding: 10px 20px;
      border: 2px solid #C8102E;
      background: transparent;
      color: #C8102E;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn:hover:not(:disabled) {
      background: #C8102E;
      color: white;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .loading {
      text-align: center;
      padding: 60px 20px;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #C8102E;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class BlogListComponent implements OnInit {
  posts: BlogPost[] = [];
  loading = true;
  currentPage = 0;
  totalPages = 0;
  pageSize = 9;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number): void {
    this.loading = true;
    this.blogService.getPublishedPosts(page, this.pageSize).subscribe({
      next: (data: BlogPostPage) => {
        this.posts = data.content;
        this.currentPage = data.pageable.pageNumber;
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blog posts:', error);
        this.loading = false;
      }
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}