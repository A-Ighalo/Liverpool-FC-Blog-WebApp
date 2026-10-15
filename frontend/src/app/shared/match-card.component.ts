import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '../models/live.model';

/** A match-centre style card: competition, crests, score or kick-off time, venue. */
@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="match-card card" [class.featured]="featured">
      <header class="match-head">
        <span class="label">{{ label }}</span>
        <span class="competition">{{ match.competition }}</span>
      </header>

      <div class="teams">
        <div class="team">
          <img *ngIf="match.home.logo" [src]="match.home.logo" [alt]="match.home.name" loading="lazy" width="56" height="56" />
          <span class="team-name">{{ match.home.shortName }}</span>
        </div>

        <div class="centre">
          <ng-container *ngIf="match.state !== 'pre'; else kickoff">
            <span class="score">{{ match.homeScore }}<span class="dash">–</span>{{ match.awayScore }}</span>
            <span class="status" [class.live]="match.state === 'in'">{{ match.statusDetail }}</span>
          </ng-container>
          <ng-template #kickoff>
            <span class="time">{{ match.date | date: 'HH:mm' }}</span>
            <span class="status">{{ match.date | date: 'EEE d MMM' }}</span>
          </ng-template>
        </div>

        <div class="team">
          <img *ngIf="match.away.logo" [src]="match.away.logo" [alt]="match.away.name" loading="lazy" width="56" height="56" />
          <span class="team-name">{{ match.away.shortName }}</span>
        </div>
      </div>

      <footer class="match-foot">
        <span *ngIf="match.venue">{{ match.venue }}</span>
        <span *ngIf="match.result" class="form-pill" [ngClass]="match.result">{{ match.result }}</span>
        <span *ngIf="!match.result && match.broadcast" class="broadcast">{{ match.broadcast }}</span>
      </footer>
    </article>
  `,
  styles: [`
    .match-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      border-top: 4px solid var(--lfc-red);
    }

    .match-card.featured {
      background: linear-gradient(160deg, var(--lfc-red) 0%, var(--lfc-red-deep) 100%);
      color: #fff;
      border-top-color: var(--lfc-gold);
    }

    .match-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
      padding: 14px 16px 0;
    }

    .label {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--lfc-red);
    }

    .featured .label {
      color: var(--lfc-gold);
    }

    .competition {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-align: right;
    }

    .featured .competition {
      color: rgba(255, 255, 255, 0.75);
    }

    .teams {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      align-items: center;
      gap: 8px;
      padding: 20px 12px;
      flex: 1;
    }

    .team {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      text-align: center;
      min-width: 0;
    }

    .team img {
      width: 56px;
      height: 56px;
      object-fit: contain;
    }

    .team-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.05rem;
      text-transform: uppercase;
      line-height: 1.1;
    }

    .centre {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      min-width: 84px;
    }

    .score,
    .time {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 2.2rem;
      line-height: 1;
    }

    .dash {
      margin: 0 6px;
      opacity: 0.5;
    }

    .status {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .featured .status {
      color: rgba(255, 255, 255, 0.8);
    }

    .status.live {
      color: #fff;
      background: var(--lfc-red);
      padding: 2px 8px;
      border-radius: 999px;
    }

    .match-foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding: 10px 16px;
      border-top: 1px solid var(--border);
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .featured .match-foot {
      border-top-color: rgba(255, 255, 255, 0.18);
      color: rgba(255, 255, 255, 0.8);
    }

    .broadcast {
      font-weight: 600;
    }
  `]
})
export class MatchCardComponent {
  @Input({ required: true }) match!: Match;
  @Input() label = '';
  @Input() featured = false;
}
