import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../services/stats.service';
import { PlayerStats } from '../../models/stats.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <header class="stats-header">
        <h1>Player Statistics</h1>
        <p>Current season performance and records</p>
      </header>

      <div class="stats-content" *ngIf="!loading">
        <!-- Top Scorers -->
        <section class="stats-section">
          <h2>🥅 Top Scorers</h2>
          <div class="stats-grid">
            <div class="stat-card" *ngFor="let player of topScorers; let i = index">
              <div class="rank">{{ i + 1 }}</div>
              <div class="player-info">
                <img *ngIf="player.playerImageUrl" [src]="player.playerImageUrl" [alt]="player.playerName" class="player-avatar" />
                <div class="player-details">
                  <h3>{{ player.playerName }}</h3>
                  <span class="position">{{ player.position }}</span>
                </div>
              </div>
              <div class="stat-value">{{ player.goals }} goals</div>
            </div>
          </div>
        </section>

        <!-- Top Assists -->
        <section class="stats-section">
          <h2>🎯 Top Assists</h2>
          <div class="stats-grid">
            <div class="stat-card" *ngFor="let player of topAssists; let i = index">
              <div class="rank">{{ i + 1 }}</div>
              <div class="player-info">
                <img *ngIf="player.playerImageUrl" [src]="player.playerImageUrl" [alt]="player.playerName" class="player-avatar" />
                <div class="player-details">
                  <h3>{{ player.playerName }}</h3>
                  <span class="position">{{ player.position }}</span>
                </div>
              </div>
              <div class="stat-value">{{ player.assists }} assists</div>
            </div>
          </div>
        </section>

        <!-- All Players Table -->
        <section class="stats-section">
          <h2>📊 All Players</h2>
          <div class="table-container">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Position</th>
                  <th>Apps</th>
                  <th>Goals</th>
                  <th>Assists</th>
                  <th>Minutes</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let player of allPlayers">
                  <td>
                    <div class="player-cell">
                      <img *ngIf="player.playerImageUrl" [src]="player.playerImageUrl" [alt]="player.playerName" class="player-avatar-small" />
                      <span>{{ player.playerName }}</span>
                    </div>
                  </td>
                  <td>{{ player.position }}</td>
                  <td>{{ player.appearances }}</td>
                  <td>{{ player.goals }}</td>
                  <td>{{ player.assists }}</td>
                  <td>{{ player.minutesPlayed }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Loading player statistics...</p>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .stats-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .stats-header h1 {
      color: #C8102E;
      font-size: 3rem;
      margin-bottom: 10px;
    }

    .stats-section {
      background: white;
      border-radius: 10px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .stats-section h2 {
      color: #00263E;
      margin-bottom: 25px;
      font-size: 1.8rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 8px;
      background: #fafafa;
    }

    .rank {
      font-size: 1.5rem;
      font-weight: bold;
      color: #C8102E;
      background: #F6EB14;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .player-info {
      display: flex;
      align-items: center;
      gap: 15px;
      flex: 1;
    }

    .player-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
    }

    .player-avatar-small {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
    }

    .player-details h3 {
      margin: 0;
      color: #00263E;
      font-size: 1.1rem;
    }

    .position {
      color: #666;
      font-size: 0.9rem;
    }

    .stat-value {
      font-weight: bold;
      color: #C8102E;
      font-size: 1.1rem;
    }

    .table-container {
      overflow-x: auto;
    }

    .stats-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .stats-table th,
    .stats-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .stats-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #00263E;
    }

    .player-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .loading {
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

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .stat-card {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class StatsComponent implements OnInit {
  topScorers: PlayerStats[] = [];
  topAssists: PlayerStats[] = [];
  allPlayers: PlayerStats[] = [];
  loading = true;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Load top scorers
    this.statsService.getTopScorers().subscribe({
      next: (scorers) => {
        this.topScorers = scorers.slice(0, 5);
      },
      error: (error) => console.error('Error loading top scorers:', error)
    });

    // Load top assists
    this.statsService.getTopAssists().subscribe({
      next: (assists) => {
        this.topAssists = assists.slice(0, 5);
      },
      error: (error) => console.error('Error loading top assists:', error)
    });

    // Load all players
    this.statsService.getAllPlayerStats(0, 25).subscribe({
      next: (data) => {
        this.allPlayers = data.content || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading all players:', error);
        this.loading = false;
      }
    });
  }
}