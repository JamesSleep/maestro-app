export interface Match {
  id: number;
  blueTeam: string;
  blueTeamScore: number;
  redTeamScore: number;
  redTeam: string;
  tournament: string;
  round: string;
  season?: string;
  matchDate: string;
  tags?: string;
  videoLink: string;
  thumbnail: string;
  poster: string;
  players: Player[];
}

export interface Player {
  id: number;
  name: string;
  picture: string;
}

export interface User {
  id: number;
  nickname: string;
  profileIcon: number | null;
}

export interface Comment {
  id: number;
  content: string;
  score: number;
}
