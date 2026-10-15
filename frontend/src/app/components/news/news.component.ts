import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { LiveDataService } from '../../services/live-data.service';
import { NewsArticle } from '../../models/live.model';
import { NewsCardComponent } from '../../shared/news-card.component';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, NewsCardComponent],
  template: `
    <section class="page-banner">
      <div class="container">
        <span class="eyebrow">Latest</span>
        <h1>News</h1>
        <p>The latest Liverpool headlines, videos and match reports.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <ng-container *ngIf="news$ | async as news; else loading">
          <div class="news-grid" *ngIf="news.length > 0; else empty">
            <app-news-card *ngFor="let article of news" [article]="article"></app-news-card>
          </div>
          <p class="attribution">Articles open on ESPN.</p>
        </ng-container>
        <ng-template #loading><div class="loading-state"><div class="spinner"></div>Loading news…</div></ng-template>
        <ng-template #empty><p class="empty-state">No news available right now.</p></ng-template>
      </div>
    </section>
  `,
  styles: [`
    .news-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }
  `]
})
export class NewsComponent {
  readonly news$: Observable<NewsArticle[]>;

  constructor(liveData: LiveDataService) {
    this.news$ = liveData.getNews(30);
  }
}
