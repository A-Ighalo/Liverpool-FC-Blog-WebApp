import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LiveDataService } from '../../services/live-data.service';
import { SquadPlayer } from '../../models/live.model';

interface SquadGroup {
  position: string;
  players: SquadPlayer[];
}

const POSITION_ORDER = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

@Component({
  selector: 'app-squad',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-banner">
      <div class="container">
        <span class="eyebrow">First Team</span>
        <h1>The Squad</h1>
        <p>The Liverpool first-team squad for the 2026/27 Premier League season.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <ng-container *ngIf="groups$ | async as groups; else loading">
          <div *ngIf="groups.length > 0; else empty">
            <section class="group" *ngFor="let group of groups">
              <h2 class="section-title">{{ group.position }}s</h2>
              <div class="grid">
                <article class="player card" *ngFor="let p of group.players">
                  <div class="photo">
                    <span class="number">{{ p.jersey || '–' }}</span>
                    <img *ngIf="p.headshot; else initials" [src]="p.headshot" [alt]="p.name" loading="lazy" />
                    <ng-template #initials><span class="initials">{{ initialsOf(p.name) }}</span></ng-template>
                  </div>
                  <div class="info">
                    <h3>{{ p.name }}</h3>
                    <div class="details">
                      <img *ngIf="p.flag" [src]="p.flag" [alt]="p.nationality" class="flag" width="20" height="20" loading="lazy" />
                      <span>{{ p.nationality }}</span>
                      <span *ngIf="p.age" class="age">· {{ p.age }} yrs</span>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </ng-container>
        <ng-template #loading><div class="loading-state"><div class="spinner"></div>Loading squad…</div></ng-template>
        <ng-template #empty><p class="empty-state">Squad data is unavailable right now.</p></ng-template>
        <p class="attribution">Data from ESPN.</p>
      </div>
    </section>
  `,
  styles: [`
    .group + .group {
      margin-top: 40px;
    }

    .group .section-title {
      margin-bottom: 16px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .player {
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }

    .player:hover {
      box-shadow: var(--shadow-hover);
      transform: translateY(-2px);
    }

    .photo {
      position: relative;
      aspect-ratio: 4 / 3;
      background:
        radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.15), transparent 50%),
        linear-gradient(150deg, var(--lfc-red) 0%, var(--lfc-red-deep) 100%);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      overflow: hidden;
    }

    .photo img {
      height: 92%;
      width: auto;
      object-fit: contain;
    }

    .number {
      position: absolute;
      top: 8px;
      left: 12px;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 2.6rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1;
    }

    .initials {
      align-self: center;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 3.4rem;
      color: rgba(255, 255, 255, 0.28);
      letter-spacing: 0.04em;
    }

    .info {
      padding: 12px 14px 14px;
      border-top: 4px solid var(--lfc-gold);
    }

    .info h3 {
      font-size: 1.3rem;
      text-transform: uppercase;
    }

    .details {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .flag {
      width: 20px;
      height: 20px;
      object-fit: contain;
    }

    @media (max-width: 480px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .info h3 {
        font-size: 1.1rem;
      }

      .number {
        font-size: 2rem;
      }
    }
  `]
})
export class SquadComponent {
  readonly groups$: Observable<SquadGroup[]>;

  constructor(liveData: LiveDataService) {
    this.groups$ = liveData.getSquad().pipe(
      map(players => {
        const byPosition = new Map<string, SquadPlayer[]>();
        for (const p of players) {
          byPosition.set(p.position, [...(byPosition.get(p.position) ?? []), p]);
        }
        const rank = (pos: string) => {
          const i = POSITION_ORDER.indexOf(pos);
          return i < 0 ? POSITION_ORDER.length : i;
        };
        return [...byPosition.entries()]
          .sort(([a], [b]) => rank(a) - rank(b))
          .map(([position, list]) => ({
            position,
            players: list.sort((a, b) => Number(a.jersey ?? 999) - Number(b.jersey ?? 999))
          }));
      })
    );
  }

  initialsOf(name: string): string {
    return name.split(' ').map(part => part[0]).slice(0, 2).join('');
  }
}
