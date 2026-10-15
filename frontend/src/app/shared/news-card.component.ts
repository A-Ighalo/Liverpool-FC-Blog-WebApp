import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsArticle } from '../models/live.model';
import { TimeAgoPipe } from './time-ago.pipe';

/** Image-led news card in the style of the official club site. Opens the source article. */
@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe],
  template: `
    <a class="news-card card" [class.horizontal]="horizontal" [href]="article.url" target="_blank" rel="noopener">
      <div class="thumb">
        <img *ngIf="article.imageUrl" [src]="article.imageUrl" [alt]="article.headline" loading="lazy" />
        <span *ngIf="article.category === 'Video'" class="play" aria-hidden="true">▶</span>
      </div>
      <div class="body">
        <span class="tag">{{ article.category }}</span>
        <h3>{{ article.headline }}</h3>
        <span class="meta">{{ article.published | timeAgo }}</span>
      </div>
    </a>
  `,
  styles: [`
    .news-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      text-decoration: none;
      color: inherit;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }

    .news-card:hover {
      box-shadow: var(--shadow-hover);
      transform: translateY(-2px);
    }

    .news-card:hover h3 {
      color: var(--lfc-red);
    }

    .thumb {
      position: relative;
      aspect-ratio: 16 / 9;
      background: var(--lfc-red-deep);
      overflow: hidden;
    }

    .thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .news-card:hover .thumb img {
      transform: scale(1.04);
    }

    .play {
      position: absolute;
      left: 12px;
      bottom: 12px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--lfc-red);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      padding-left: 2px;
    }

    .body {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 14px 16px 16px;
      flex: 1;
    }

    h3 {
      font-size: 1.3rem;
      transition: color 0.2s ease;
    }

    .meta {
      margin-top: auto;
    }

    .horizontal {
      flex-direction: row;
    }

    .horizontal .thumb {
      flex: 0 0 38%;
      aspect-ratio: auto;
      min-height: 96px;
    }

    .horizontal h3 {
      font-size: 1.1rem;
    }

    .horizontal .body {
      padding: 10px 12px;
    }
  `]
})
export class NewsCardComponent {
  @Input({ required: true }) article!: NewsArticle;
  @Input() horizontal = false;
}
