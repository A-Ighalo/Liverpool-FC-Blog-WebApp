export interface PlayerStats {
  id?: number;
  playerName: string;
  position: string;
  jerseyNumber?: number;
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  season: string;
  playerImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Fixture {
  id?: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  matchDate: Date;
  venue?: string;
  competition: Competition;
  status: MatchStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum Competition {
  PREMIER_LEAGUE = 'PREMIER_LEAGUE',
  CHAMPIONS_LEAGUE = 'CHAMPIONS_LEAGUE',
  FA_CUP = 'FA_CUP',
  LEAGUE_CUP = 'LEAGUE_CUP',
  EUROPA_LEAGUE = 'EUROPA_LEAGUE',
  FRIENDLY = 'FRIENDLY'
}

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
  POSTPONED = 'POSTPONED',
  CANCELLED = 'CANCELLED'
}