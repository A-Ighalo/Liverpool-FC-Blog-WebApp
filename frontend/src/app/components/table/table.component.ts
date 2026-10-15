import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LiveDataService } from '../../services/live-data.service';
import { TableRow } from '../../models/live.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-banner">
      <div class="container">
        <span class="eyebrow">Season 2026/27</span>
        <h1>Premier League Table</h1>
        <p>Where the Reds stand in the race for the title.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <ng-container *ngIf="table$ | async as rows; else loading">
          <div class="card table-card" *ngIf="rows.length > 0; else empty">
            <div class="scroll">
              <table>
                <thead>
                  <tr>
                    <th class="pos">Pos</th>
                    <th class="club">Club</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GD</th>
                    <th class="pts">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of rows" [class.highlight]="row.team.id === liverpoolId">
                    <td class="pos">
                      <span class="zone" [style.background]="row.zoneColor || 'transparent'" [title]="row.zone || ''"></span>
                      {{ row.rank }}
                    </td>
                    <td class="club">
                      <img *ngIf="row.team.logo" [src]="row.team.logo" alt="" width="26" height="26" loading="lazy" />
                      <span class="full">{{ row.team.name }}</span>
                      <span class="short">{{ row.team.shortName }}</span>
                    </td>
                    <td>{{ row.played }}</td>
                    <td>{{ row.won }}</td>
                    <td>{{ row.drawn }}</td>
                    <td>{{ row.lost }}</td>
                    <td>{{ row.goalDifference }}</td>
                    <td class="pts">{{ row.points }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <ul class="legend" *ngIf="zones$ | async as zones">
            <li *ngFor="let z of zones"><span class="zone" [style.background]="z.color"></span>{{ z.name }}</li>
          </ul>
        </ng-container>
        <ng-template #loading><div class="loading-state"><div class="spinner"></div>Loading table…</div></ng-template>
        <ng-template #empty><p class="empty-state">The table is unavailable right now.</p></ng-template>
        <p class="attribution">Data from ESPN.</p>
      </div>
    </section>
  `,
  styles: [`
    .table-card {
      padding: 8px 0;
    }

    .scroll {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }

    th {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-muted);
      padding: 10px 8px;
      text-align: center;
      border-bottom: 2px solid var(--border);
    }

    td {
      text-align: center;
      padding: 12px 8px;
      border-bottom: 1px solid var(--border);
    }

    tr:last-child td {
      border-bottom: 0;
    }

    .pos {
      position: relative;
      width: 56px;
      font-weight: 700;
    }

    td.pos .zone {
      position: absolute;
      left: 0;
      top: 6px;
      bottom: 6px;
      width: 4px;
      border-radius: 0 2px 2px 0;
    }

    .club {
      text-align: left;
    }

    td.club {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
      white-space: nowrap;
    }

    td.club img {
      width: 26px;
      height: 26px;
      object-fit: contain;
    }

    .short {
      display: none;
    }

    .pts {
      font-weight: 800;
      font-family: var(--font-display);
      font-size: 1.15rem;
    }

    tr.highlight td {
      background: rgba(200, 16, 46, 0.08);
      color: var(--lfc-red);
      font-weight: 700;
    }

    .legend {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 14px;
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .legend li {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .legend .zone {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    @media (max-width: 640px) {
      .full {
        display: none;
      }

      .short {
        display: inline;
      }

      th, td {
        padding-left: 4px;
        padding-right: 4px;
      }
    }
  `]
})
export class TableComponent {
  readonly liverpoolId = LiveDataService.LIVERPOOL_ID;
  readonly table$: Observable<TableRow[]>;
  readonly zones$: Observable<{ name: string; color: string }[]>;

  constructor(liveData: LiveDataService) {
    this.table$ = liveData.getTable();
    this.zones$ = this.table$.pipe(
      map(rows => {
        const zones = new Map<string, string>();
        rows.forEach(r => r.zone && r.zoneColor && !zones.has(r.zone) && zones.set(r.zone, r.zoneColor));
        return [...zones].map(([name, color]) => ({ name, color }));
      })
    );
  }
}
