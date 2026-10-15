import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BlogService } from '../../services/blog.service';
import { LiveDataService } from '../../services/live-data.service';
import { BlogPost } from '../../models/blog.model';
import { Match, NewsArticle, StatLeader, TableRow } from '../../models/live.model';
import { MatchCardComponent } from '../../shared/match-card.component';
import { NewsCardComponent } from '../../shared/news-card.component';
import { TimeAgoPipe } from '../../shared/time-ago.pipe';

interface MatchCentre {
  cards: { label: string; match: Match; featured: boolean }[];
  form: Match[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatchCardComponent, NewsCardComponent, TimeAgoPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  readonly liverpoolId = LiveDataService.LIVERPOOL_ID;
  readonly news$: Observable<NewsArticle[]>;
  readonly matchCentre$: Observable<MatchCentre>;
  readonly tableSnippet$: Observable<TableRow[]>;
  readonly leaders$: Observable<{ goals: StatLeader[]; assists: StatLeader[] }>;
  readonly posts$: Observable<BlogPost[]>;

  constructor(liveData: LiveDataService, blogService: BlogService) {
    this.news$ = liveData.getNews(12);

    this.matchCentre$ = combineLatest([liveData.getResults(), liveData.getFixtures()]).pipe(
      map(([results, fixtures]) => {
        const cards: MatchCentre['cards'] = [];
        if (results[0]) cards.push({ label: 'Last match', match: results[0], featured: false });
        if (fixtures[0]) cards.push({ label: 'Next match', match: fixtures[0], featured: true });
        if (fixtures[1]) cards.push({ label: 'Coming up', match: fixtures[1], featured: false });
        return { cards, form: results.filter(r => r.result).slice(0, 5).reverse() };
      })
    );

    this.tableSnippet$ = liveData.getTable().pipe(
      map(rows => {
        const index = rows.findIndex(r => r.team.id === this.liverpoolId);
        if (index < 0) return rows.slice(0, 5);
        const start = Math.min(Math.max(index - 2, 0), Math.max(rows.length - 5, 0));
        return rows.slice(start, start + 5);
      })
    );

    this.leaders$ = liveData.getLeaders().pipe(
      map(leaders => ({
        goals: leaders.goals.filter(l => l.isLiverpool).slice(0, 3),
        assists: leaders.assists.filter(l => l.isLiverpool).slice(0, 3)
      }))
    );

    this.posts$ = blogService.getPublishedPosts(0, 3).pipe(
      map(page => page.content ?? []),
      catchError(() => of([]))
    );
  }
}
