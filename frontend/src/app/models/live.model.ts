// Models for live data pulled from ESPN's public (keyless) soccer API.

export interface TeamRef {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
}

export type MatchState = 'pre' | 'in' | 'post';

export interface Match {
  id: string;
  date: Date;
  competition: string;
  venue?: string;
  home: TeamRef;
  away: TeamRef;
  homeScore?: number;
  awayScore?: number;
  state: MatchState;
  statusDetail: string;
  isHome: boolean;
  result?: 'W' | 'D' | 'L';
  broadcast?: string;
}

export interface TableRow {
  rank: number;
  team: TeamRef;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDifference: string;
  points: number;
  zone?: string;
  zoneColor?: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  description: string;
  published: Date;
  imageUrl?: string;
  url?: string;
  category: string;
}

export interface SquadPlayer {
  id: string;
  name: string;
  jersey?: string;
  position: string;
  age?: number;
  nationality?: string;
  flag?: string;
  headshot?: string;
}

export interface StatLeader {
  name: string;
  team: TeamRef;
  value: number;
  matches: number;
  isLiverpool: boolean;
}

export interface Leaders {
  goals: StatLeader[];
  assists: StatLeader[];
}
