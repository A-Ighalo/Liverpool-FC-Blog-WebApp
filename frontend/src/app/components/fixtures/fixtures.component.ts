import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { LiveDataService } from '../../services/live-data.service';
import { Match } from '../../models/live.model';

@Component({
  selector: 'app-fixtures',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-banner">
      <div class="container">
        <span class="eyebrow">Season 2026/27</span>
        <h1>Fixtures &amp; Results</h1>
        <p>Every Liverpool match across the Premier League, Europe and the cups.</p>
      </div>
    </section>

    <div class="tabs-bar">
      <div class="container tabs" role="tablist">
        <button type="button" role="tab" [attr.aria-selected]="tab === 'fixtures'" [class.active]="tab === 'fixtures'" (click)="tab = 'fixtures'">Fixtures</button>
        <button type="button" role="tab" [attr.aria-selected]="tab === 'results'" [class.active]="tab === 'results'" (click)="tab = 'results'">Results</button>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <ng-container *ngIf="(tab === 'fixtures' ? fixtures$ : results$) | async as matches; else loading">
          <div class="match-list" *ngIf="matches.length > 0; else empty">
            <ng-container *ngFor="let m of matches; let i = index">
              <h2 class="month" *ngIf="i === 0 || monthKey(m) !== monthKey(matches[i - 1])">{{ m.date | date: 'MMMM yyyy' }}</h2>
              <article class="row card">
                <div class="when">
                  <span class="day">{{ m.date | date: 'EEE' }}</span>
                  <span class="date">{{ m.date | date: 'd' }}</span>
                  <span class="mon">{{ m.date | date: 'MMM' }}</span>
                </div>

                <div class="fixture">
                  <span class="comp">{{ m.competition }}</span>
                  <div class="teams">
                    <span class="team home" [class.us]="m.isHome">
                      <span class="name">{{ m.home.name }}</span>
                      <img *ngIf="m.home.logo" [src]="m.home.logo" alt="" width="32" height="32" loading="lazy" />
                    </span>
                    <span class="mid" *ngIf="m.state !== 'pre'; else ko">
                      {{ m.homeScore }} – {{ m.awayScore }}
                    </span>
                    <ng-template #ko><span class="mid ko">{{ m.date | date: 'HH:mm' }}</span></ng-template>
                    <span class="team away" [class.us]="!m.isHome">
                      <img *ngIf="m.away.logo" [src]="m.away.logo" alt="" width="32" height="32" loading="lazy" />
                      <span class="name">{{ m.away.name }}</span>
                    </span>
                  </div>
                  <span class="venue" *ngIf="m.venue">{{ m.venue }}</span>
                </div>

                <div class="outcome">
                  <span *ngIf="m.result" class="form-pill" [ngClass]="m.result">{{ m.result }}</span>
                  <span *ngIf="!m.result && m.broadcast" class="broadcast">{{ m.broadcast }}</span>
                </div>
              </article>
            </ng-container>
          </div>
        </ng-container>
        <ng-template #loading><div class="loading-state"><div class="spinner"></div>Loading matches…</div></ng-template>
        <ng-template #empty><p class="empty-state">No matches to show.</p></ng-template>
        <p class="attribution">Kick-off times are shown in your local time zone. Data from ESPN.</p>
      </div>
    </section>
  `,
  styles: [`
    .tabs-bar {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 72px;
      z-index: 10;
    }

    .tabs {
      display: flex;
      gap: 8px;
    }

    .tabs button {
      background: none;
      border: 0;
      padding: 16px 12px;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.15rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      cursor: pointer;
      border-bottom: 4px solid transparent;
    }

    .tabs button.active {
      color: var(--lfc-red);
      border-bottom-color: var(--lfc-red);
    }

    .match-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .month {
      font-size: 1.4rem;
      text-transform: uppercase;
      margin: 18px 0 4px;
    }

    .month:first-child {
      margin-top: 0;
    }

    .row {
      display: grid;
      grid-template-columns: 72px minmax(0, 1fr) 72px;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-left: 4px solid var(--lfc-red);
    }

    .when {
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1;
      font-family: var(--font-display);
      text-transform: uppercase;
    }

    .day, .mon {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .date {
      font-size: 2rem;
      font-weight: 800;
      margin: 2px 0;
    }

    .fixture {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }

    .comp {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--lfc-red);
    }

    .teams {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      align-items: center;
      gap: 12px;
      width: 100%;
    }

    .team {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 1.2rem;
      text-transform: uppercase;
    }

    .team.home {
      justify-content: flex-end;
      text-align: right;
    }

    .team.us {
      font-weight: 800;
    }

    .team img {
      width: 32px;
      height: 32px;
      object-fit: contain;
      flex-shrink: 0;
    }

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mid {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.5rem;
      background: var(--lfc-ink);
      color: #fff;
      padding: 4px 12px;
      border-radius: 4px;
      min-width: 76px;
      text-align: center;
    }

    .mid.ko {
      background: var(--surface-alt);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .venue {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .outcome {
      display: flex;
      justify-content: center;
    }

    .broadcast {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-align: center;
    }

    @media (max-width: 640px) {
      .row {
        grid-template-columns: 44px minmax(0, 1fr);
        padding: 12px;
        gap: 10px;
      }

      .fixture {
        align-items: stretch;
      }

      .teams {
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-areas: "home mid" "away mid";
        row-gap: 8px;
      }

      .team.home {
        grid-area: home;
        flex-direction: row-reverse;
        justify-content: flex-end;
        text-align: left;
      }

      .team.away {
        grid-area: away;
      }

      .team {
        font-size: 1.05rem;
      }

      .team img {
        width: 24px;
        height: 24px;
      }

      .mid {
        grid-area: mid;
        font-size: 1.2rem;
        min-width: 64px;
        padding: 4px 8px;
      }

      .outcome {
        grid-column: 1 / -1;
        justify-content: flex-end;
        margin-top: -4px;
      }

      .outcome:empty {
        display: none;
      }
    }
  `]
})
export class FixturesComponent {
  readonly fixtures$: Observable<Match[]>;
  readonly results$: Observable<Match[]>;
  tab: 'fixtures' | 'results' = 'fixtures';

  constructor(liveData: LiveDataService) {
    this.fixtures$ = liveData.getFixtures();
    this.results$ = liveData.getResults();
  }

  monthKey(m: Match): string {
    return `${m.date.getFullYear()}-${m.date.getMonth()}`;
  }
}
