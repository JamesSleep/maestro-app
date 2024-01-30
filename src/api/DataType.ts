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
  history: History[];
  winning: Winning[];
  user: User[];
  mainProfile: string;
  realName: string;
  birth: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Gallery {
  id: number;
  uri: string;
}

export interface History {
  team: string;
  start: string;
  end: string;
}

export interface Winning {
  title: string;
}
