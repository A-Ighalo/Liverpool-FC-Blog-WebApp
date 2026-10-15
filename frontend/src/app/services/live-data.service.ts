import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import {
  Leaders, Match, NewsArticle, SquadPlayer, StatLeader, TableRow, TeamRef
} from '../models/live.model';

/**
 * Live Liverpool FC data from ESPN's public (keyless) soccer API, read through the
 * backend's /api/live/public proxy because ESPN does not reliably allow browser CORS requests.
 * The API is unofficial, so every call falls back to an empty result on error.
 */
@Injectable({
  providedIn: 'root'
})
export class LiveDataService {
  static readonly LIVERPOOL_ID = '364';
  static readonly CREST_URL = 'https://a.espncdn.com/i/teamlogos/soccer/500/364.png';

  private apiUrl = 'http://localhost:8080/api/live/public';
  private cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) { }

  /** Upcoming matches across all competitions, soonest first. */
  getFixtures(): Observable<Match[]> {
    return this.get(`${this.apiUrl}/fixtures`).pipe(
      map(data => this.mapEvents(data).sort((a, b) => a.date.getTime() - b.date.getTime()))
    );
  }

  /** Completed matches across all competitions, most recent first. */
  getResults(): Observable<Match[]> {
    return this.get(`${this.apiUrl}/results`).pipe(
      map(data => this.mapEvents(data)
        .filter(m => m.state === 'post')
        .sort((a, b) => b.date.getTime() - a.date.getTime()))
    );
  }

  getTable(): Observable<TableRow[]> {
    return this.get(`${this.apiUrl}/table`).pipe(
      map(data => {
        const entries: any[] = data?.children?.[0]?.standings?.entries ?? [];
        return entries.map(e => {
          const stat = (name: string) => e.stats?.find((s: any) => s.name === name);
          return {
            rank: Number(stat('rank')?.value ?? 0),
            team: this.mapTeam(e.team),
            played: Number(stat('gamesPlayed')?.value ?? 0),
            won: Number(stat('wins')?.value ?? 0),
            drawn: Number(stat('ties')?.value ?? 0),
            lost: Number(stat('losses')?.value ?? 0),
            goalDifference: stat('pointDifferential')?.displayValue ?? '0',
            points: Number(stat('points')?.value ?? 0),
            zone: e.note?.description,
            zoneColor: e.note?.color?.replace(/^#+/, '#')
          } as TableRow;
        }).sort((a, b) => a.rank - b.rank);
      })
    );
  }

  getNews(limit: number = 12): Observable<NewsArticle[]> {
    return this.get(`${this.apiUrl}/news?limit=${limit}`).pipe(
      map(data => (data?.articles ?? []).map((a: any) => ({
        id: String(a.id),
        headline: a.headline,
        description: a.description ?? '',
        published: new Date(a.published),
        imageUrl: a.images?.[0]?.url,
        url: a.links?.web?.href,
        category: this.newsCategory(a.type)
      } as NewsArticle)))
    );
  }

  getSquad(): Observable<SquadPlayer[]> {
    return this.get(`${this.apiUrl}/squad`).pipe(
      map(data => (data?.athletes ?? []).map((a: any) => ({
        id: String(a.id),
        name: a.displayName,
        jersey: a.jersey,
        position: a.position?.displayName ?? 'Unknown',
        age: a.age,
        nationality: a.citizenship,
        flag: a.flag?.href,
        headshot: a.headshot?.href
      } as SquadPlayer)))
    );
  }

  /** Premier League goal and assist leaders (top 50 league-wide). */
  getLeaders(): Observable<Leaders> {
    return this.get(`${this.apiUrl}/leaders`).pipe(
      map(data => {
        const category = (name: string): StatLeader[] =>
          (data?.stats?.find((s: any) => s.name === name)?.leaders ?? []).map((l: any) => ({
            name: l.athlete?.displayName,
            team: this.mapTeam(l.athlete?.team),
            value: Number(l.value ?? 0),
            matches: Number(/M: (\d+)/.exec(l.shortDisplayValue ?? '')?.[1] ?? 0),
            isLiverpool: l.athlete?.team?.id === LiveDataService.LIVERPOOL_ID
          }));
        return { goals: category('goalsLeaders'), assists: category('assistsLeaders') };
      })
    );
  }

  private get(url: string): Observable<any> {
    if (!this.cache.has(url)) {
      this.cache.set(url, this.http.get<any>(url).pipe(
        catchError(error => {
          console.error('Live data request failed:', url, error);
          this.cache.delete(url);
          return of(null);
        }),
        shareReplay(1)
      ));
    }
    return this.cache.get(url)!;
  }

  private mapEvents(data: any): Match[] {
    const seen = new Set<string>();
    const matches: Match[] = [];
    for (const event of data?.events ?? []) {
      if (seen.has(event.id)) continue;
      seen.add(event.id);
      const comp = event.competitions?.[0];
      const home = comp?.competitors?.find((c: any) => c.homeAway === 'home');
      const away = comp?.competitors?.find((c: any) => c.homeAway === 'away');
      if (!home || !away) continue;

      const status = comp.status?.type ?? event.status?.type ?? {};
      const homeScore = this.score(home.score);
      const awayScore = this.score(away.score);
      const isHome = home.team?.id === LiveDataService.LIVERPOOL_ID;
      const match: Match = {
        id: String(event.id),
        date: new Date(event.date),
        competition: event.league?.name ?? event.season?.displayName ?? '',
        venue: comp.venue?.fullName,
        home: this.mapTeam(home.team),
        away: this.mapTeam(away.team),
        homeScore,
        awayScore,
        state: status.state ?? 'pre',
        statusDetail: status.shortDetail ?? status.detail ?? '',
        isHome,
        broadcast: comp.broadcasts?.[0]?.media?.shortName
      };
      if (match.state === 'post' && homeScore !== undefined && awayScore !== undefined) {
        const ours = isHome ? homeScore : awayScore;
        const theirs = isHome ? awayScore : homeScore;
        match.result = ours > theirs ? 'W' : ours < theirs ? 'L' : 'D';
      }
      matches.push(match);
    }
    return matches;
  }

  private mapTeam(team: any): TeamRef {
    return {
      id: String(team?.id ?? ''),
      name: team?.displayName ?? team?.name ?? '',
      shortName: team?.shortDisplayName ?? team?.abbreviation ?? team?.displayName ?? '',
      logo: team?.logos?.[0]?.href ?? team?.logo
    };
  }

  private score(score: any): number | undefined {
    if (score === undefined || score === null) return undefined;
    const value = typeof score === 'object' ? score.value ?? score.displayValue : score;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }

  private newsCategory(type: string): string {
    switch (type) {
      case 'Media': return 'Video';
      case 'Recap': return 'Match Report';
      case 'HeadlineNews': return 'Headlines';
      default: return 'News';
    }
  }
}
