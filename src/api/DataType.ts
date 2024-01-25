export interface Match {
  id: number;
  blueTeam: string;
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
