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
    <section class="page-banner">
      <div class="container">
        <span class="eyebrow">Written by fans</span>
        <h1>Fan Blog</h1>
        <p>Opinion, analysis and match reactions from Liverpool FC Hub members.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <ng-container *ngIf="!loading; else loadingTpl">
          <div class="posts-grid" *ngIf="posts.length > 0; else noPosts">
            <a class="post-card card" *ngFor="let post of posts" [routerLink]="['/blog', post.id]">
              <div class="post-image">
                <img *ngIf="post.imageUrl" [src]="post.imageUrl" [alt]="post.title" loading="lazy" />
                <img *ngIf="!post.imageUrl" src="https://a.espncdn.com/i/teamlogos/soccer/500/364.png" alt="" class="crest" />
              </div>
              <div class="post-content">
                <span class="tag">Fan Blog</span>
                <h2>{{ post.title }}</h2>
                <p class="post-summary">{{ post.summary }}</p>
                <span class="meta">
                  <ng-container *ngIf="post.author">{{ post.author.username }} · </ng-container>{{ formatDate(post.publishedAt) }}
                </span>
              </div>
            </a>
          </div>

          <ng-template #noPosts>
            <div class="no-posts card">
              <h3>No blog posts yet</h3>
              <p>Posts written by Hub members will appear here. Check back soon.</p>
            </div>
          </ng-template>

          <div class="pagination" *ngIf="totalPages > 1">
            <button (click)="loadPage(currentPage - 1)" [disabled]="currentPage === 0" class="btn btn-outline" type="button">Previous</button>
            <span class="page-info">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
            <button (click)="loadPage(currentPage + 1)" [disabled]="currentPage === totalPages - 1" class="btn btn-outline" type="button">Next</button>
          </div>
        </ng-container>

        <ng-template #loadingTpl>
          <div class="loading-state"><div class="spinner"></div>Loading blog posts…</div>
        </ng-template>
      </div>
    </section>
  `,
  styles: [`
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .post-card {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: inherit;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }

    .post-card:hover {
      box-shadow: var(--shadow-hover);
      transform: translateY(-2px);
    }

    .post-card:hover h2 {
      color: var(--lfc-red);
    }

    .post-image {
      aspect-ratio: 16 / 9;
      background: linear-gradient(135deg, var(--lfc-red), var(--lfc-red-deep));
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .post-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .post-image img.crest {
      width: 72px;
      height: 72px;
      object-fit: contain;
    }

    .post-content {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 16px;
      flex: 1;
    }

    .post-content h2 {
      font-size: 1.5rem;
      transition: color 0.2s ease;
    }

    .post-summary {
      color: var(--text-muted);
      font-size: 0.95rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-content .meta {
      margin-top: auto;
      padding-top: 6px;
    }

    .no-posts {
      text-align: center;
      padding: 48px 16px;
    }

    .no-posts h3 {
      font-size: 1.6rem;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .no-posts p {
      color: var(--text-muted);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 32px;
    }

    .page-info {
      font-size: 0.9rem;
      color: var(--text-muted);
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
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}