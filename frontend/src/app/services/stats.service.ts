import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerStats, Fixture } from '../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Player Stats
  getAllPlayerStats(page: number = 0, size: number = 20, season?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (season) {
      params = params.set('season', season);
    }
    
    return this.http.get<any>(`${this.apiUrl}/stats/public/all`, { params });
  }

  getTopScorers(season: string = '2023-24'): Observable<PlayerStats[]> {
    const params = new HttpParams().set('season', season);
    return this.http.get<PlayerStats[]>(`${this.apiUrl}/stats/public/top-scorers`, { params });
  }

  getTopAssists(season: string = '2023-24'): Observable<PlayerStats[]> {
    const params = new HttpParams().set('season', season);
    return this.http.get<PlayerStats[]>(`${this.apiUrl}/stats/public/top-assists`, { params });
  }

  getAvailableSeasons(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/stats/public/seasons`);
  }

  getPlayerStats(id: number): Observable<PlayerStats> {
    return this.http.get<PlayerStats>(`${this.apiUrl}/stats/public/${id}`);
  }

  getPlayerStatsByName(playerName: string, season: string = '2023-24'): Observable<PlayerStats> {
    const params = new HttpParams().set('season', season);
    return this.http.get<PlayerStats>(`${this.apiUrl}/stats/public/player/${playerName}`, { params });
  }

  // Fixtures
  getAllFixtures(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.apiUrl}/fixtures/public/all`, { params });
  }

  getUpcomingFixtures(): Observable<Fixture[]> {
    return this.http.get<Fixture[]>(`${this.apiUrl}/fixtures/public/upcoming`);
  }

  getRecentFixtures(): Observable<Fixture[]> {
    return this.http.get<Fixture[]>(`${this.apiUrl}/fixtures/public/recent`);
  }

  getLiverpoolFixtures(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<any>(`${this.apiUrl}/fixtures/public/liverpool`, { params });
  }

  getFixture(id: number): Observable<Fixture> {
    return this.http.get<Fixture>(`${this.apiUrl}/fixtures/public/${id}`);
  }

  // Admin endpoints
  createPlayerStats(stats: PlayerStats): Observable<PlayerStats> {
    return this.http.post<PlayerStats>(`${this.apiUrl}/stats`, stats);
  }

  updatePlayerStats(id: number, stats: PlayerStats): Observable<PlayerStats> {
    return this.http.put<PlayerStats>(`${this.apiUrl}/stats/${id}`, stats);
  }

  deletePlayerStats(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/stats/${id}`);
  }

  createFixture(fixture: Fixture): Observable<Fixture> {
    return this.http.post<Fixture>(`${this.apiUrl}/fixtures`, fixture);
  }

  updateFixture(id: number, fixture: Fixture): Observable<Fixture> {
    return this.http.put<Fixture>(`${this.apiUrl}/fixtures/${id}`, fixture);
  }

  deleteFixture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/fixtures/${id}`);
  }
}