export interface Match {
  id: number;
  blueTeam: string;
  blueTeamScore: number;
  redTeamScore: number;
  redTeam: string;
  tournament: string;
  round: string;
  score: number;
  season?: string;
  matchDate: string;
  tags?: string;
  videoLink: string;
  thumbnail: string;
  poster: string;
  players: Player[];
  user: User[];
  comment: Comment[];
  gallery: Gallery[];
  potg: string;
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
  user: User;
}

export interface Gallery {
  id: number;
  uri: string;
}
