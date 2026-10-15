import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../models/blog.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="blog-detail-container">
      <nav class="breadcrumb">
        <a routerLink="/blog">← Back to Blog</a>
      </nav>

      <article class="blog-article" *ngIf="post && !loading">
        <header class="article-header">
          <h1>{{ post.title }}</h1>
          <div class="article-meta">
            <span>{{ formatDate(post.publishedAt) }}</span>
            <span *ngIf="post.author">by {{ post.author.username }}</span>
          </div>
        </header>

        <div class="article-image" *ngIf="post.imageUrl">
          <img [src]="post.imageUrl" [alt]="post.title" />
        </div>

        <div class="article-content">
          <div class="article-summary">
            {{ post.summary }}
          </div>
          <div class="article-body" [innerHTML]="post.content"></div>
        </div>
      </article>

      <div class="loading" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Loading article...</p>
      </div>

      <div class="error" *ngIf="error">
        <h3>Article not found</h3>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <a routerLink="/blog" class="btn btn-primary">Back to Blog</a>
      </div>
    </div>
  `,
  styles: [`
    .blog-detail-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .breadcrumb {
      margin-bottom: 30px;
    }

    .breadcrumb a {
      color: #C8102E;
      text-decoration: none;
      font-weight: 600;
    }

    .blog-article {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .article-header {
      padding: 40px 40px 20px;
      border-bottom: 1px solid #eee;
    }

    .article-header h1 {
      color: var(--text);
      font-size: 2.5rem;
      margin-bottom: 15px;
      line-height: 1.2;
    }

    .article-meta {
      color: #666;
      font-size: 0.9rem;
    }

    .article-image img {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }

    .article-content {
      padding: 40px;
    }

    .article-summary {
      font-size: 1.2rem;
      color: #666;
      font-style: italic;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }

    .article-body {
      line-height: 1.8;
      color: #333;
    }

    .loading, .error {
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

    .btn {
      padding: 12px 24px;
      background: #C8102E;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      display: inline-block;
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .article-header {
        padding: 30px 20px 15px;
      }

      .article-header h1 {
        font-size: 2rem;
      }

      .article-content {
        padding: 30px 20px;
      }
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  post: BlogPost | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(+id);
    }
  }

  loadPost(id: number): void {
    this.blogService.getPublishedPost(id).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blog post:', error);
        this.error = true;
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