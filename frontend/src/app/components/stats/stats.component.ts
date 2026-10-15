import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LiveDataService } from '../../services/live-data.service';
import { Leaders } from '../../models/live.model';

interface SeasonRecord {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-banner">
      <div class="container">
        <span class="eyebrow">Season 2026/27</span>
        <h1>Stats</h1>
        <p>How the Reds are performing this season, and where they rank among the league's best.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section-title heading">Season Record</h2>
        <p class="sub">All competitions, competitive matches only.</p>
        <ng-container *ngIf="record$ | async as r; else loading">
          <div class="tiles">
            <div class="tile card"><span class="value">{{ r.played }}</span><span class="label">Played</span></div>
            <div class="tile card"><span class="value win">{{ r.won }}</span><span class="label">Won</span></div>
            <div class="tile card"><span class="value">{{ r.drawn }}</span><span class="label">Drawn</span></div>
            <div class="tile card"><span class="value loss">{{ r.lost }}</span><span class="label">Lost</span></div>
            <div class="tile card"><span class="value">{{ r.goalsFor }}</span><span class="label">Goals scored</span></div>
            <div class="tile card"><span class="value">{{ r.goalsAgainst }}</span><span class="label">Goals conceded</span></div>
            <div class="tile card"><span class="value">{{ r.cleanSheets }}</span><span class="label">Clean sheets</span></div>
          </div>
        </ng-container>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section-title heading">Premier League Leaders</h2>
        <p class="sub">The league's top 10. Liverpool players are highlighted.</p>
        <ng-container *ngIf="leaders$ | async as leaders; else loading">
          <div class="boards" *ngIf="leaders.goals.length || leaders.assists.length; else empty">
            <div class="card board" *ngFor="let board of [
              { title: 'Goals', rows: leaders.goals },
              { title: 'Assists', rows: leaders.assists }
            ]">
              <h3>{{ board.title }}</h3>
              <ol>
                <li *ngFor="let p of board.rows.slice(0, 10); let i = index" [class.ours]="p.isLiverpool">
                  <span class="rank">{{ i + 1 }}</span>
                  <img *ngIf="p.team.logo" [src]="p.team.logo" [alt]="p.team.name" width="24" height="24" loading="lazy" />
                  <span class="who">
                    <span class="name">{{ p.name }}</span>
                    <span class="team">{{ p.team.name }} · {{ p.matches }} apps</span>
                  </span>
                  <span class="num">{{ p.value }}</span>
                </li>
              </ol>
              <div class="reds" *ngIf="redsOutsideTop10(board.rows) as reds">
                <ng-container *ngIf="reds.length">
                  <h4>Other Reds on the board</h4>
                  <p>
                    <span *ngFor="let p of reds; let last = last">{{ p.name }} ({{ p.value }}){{ last ? '' : ', ' }}</span>
                  </p>
                </ng-container>
              </div>
            </div>
          </div>
        </ng-container>
        <ng-template #loading><div class="loading-state"><div class="spinner"></div>Loading stats…</div></ng-template>
        <ng-template #empty><p class="empty-state">Stats are unavailable right now.</p></ng-template>
        <p class="attribution">Data from ESPN.</p>
      </div>
    </section>
  `,
  styles: [`
    .heading {
      margin-bottom: 4px;
    }

    .sub {
      color: var(--text-muted);
      margin-bottom: 20px;
      font-size: 0.9rem;
    }

    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }

    .tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 12px;
      border-bottom: 4px solid var(--lfc-red);
    }

    .value {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 2.8rem;
      line-height: 1;
    }

    .value.win { color: var(--win); }
    .value.loss { color: var(--loss); }

    .label {
      margin-top: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
      text-align: center;
    }

    .boards {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .board {
      padding: 20px;
    }

    .board h3 {
      font-size: 1.6rem;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    ol {
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 8px;
      border-bottom: 1px solid var(--border);
    }

    li.ours {
      background: rgba(200, 16, 46, 0.08);
      border-left: 4px solid var(--lfc-red);
      padding-left: 4px;
    }

    li img {
      width: 24px;
      height: 24px;
      object-fit: contain;
    }

    .rank {
      width: 22px;
      font-family: var(--font-display);
      font-weight: 700;
      color: var(--text-muted);
      text-align: center;
    }

    .who {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .name {
      font-weight: 600;
    }

    li.ours .name {
      color: var(--lfc-red);
    }

    .team {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .num {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 1.6rem;
    }

    .reds h4 {
      margin-top: 16px;
      font-size: 0.95rem;
      text-transform: uppercase;
      color: var(--lfc-red);
    }

    .reds p {
      font-size: 0.9rem;
      margin-top: 4px;
    }

    @media (max-width: 800px) {
      .boards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class StatsComponent {
  readonly leaders$: Observable<Leaders>;
  readonly record$: Observable<SeasonRecord>;

  constructor(liveData: LiveDataService) {
    this.leaders$ = liveData.getLeaders();
    this.record$ = liveData.getResults().pipe(
      map(results => {
        const competitive = results.filter(m => m.result && !/friendly/i.test(m.competition));
        const record: SeasonRecord = { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, cleanSheets: 0 };
        for (const m of competitive) {
          const scored = (m.isHome ? m.homeScore : m.awayScore) ?? 0;
          const conceded = (m.isHome ? m.awayScore : m.homeScore) ?? 0;
          record.played++;
          if (m.result === 'W') record.won++;
          if (m.result === 'D') record.drawn++;
          if (m.result === 'L') record.lost++;
          record.goalsFor += scored;
          record.goalsAgainst += conceded;
          if (conceded === 0) record.cleanSheets++;
        }
        return record;
      })
    );
  }

  redsOutsideTop10(rows: Leaders['goals']): Leaders['goals'] {
    return rows.slice(10).filter(p => p.isLiverpool);
  }
}
