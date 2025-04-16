
// Mock data for 10 IPL teams with stats
export interface TeamStats {
  id: number;
  name: string;
  logo: string;
  color: string;
  dotBallsPlayed: number;
  treesPlanted: number;
}

export const teams: TeamStats[] = [
  {
    id: 1,
    name: "Mumbai Indians",
    logo: "MI",
    color: "#004BA0",
    dotBallsPlayed: 245,
    treesPlanted: 76,
  },
  {
    id: 2,
    name: "Chennai Super Kings",
    logo: "CSK",
    color: "#FFFF00",
    dotBallsPlayed: 278,
    treesPlanted: 92,
  },
  {
    id: 3,
    name: "Royal Challengers Bangalore",
    logo: "RCB",
    color: "#EC1C24",
    dotBallsPlayed: 301,
    treesPlanted: 85,
  },
  {
    id: 4,
    name: "Kolkata Knight Riders",
    logo: "KKR",
    color: "#3A225D",
    dotBallsPlayed: 189,
    treesPlanted: 60,
  },
  {
    id: 5,
    name: "Delhi Capitals",
    logo: "DC",
    color: "#00008B",
    dotBallsPlayed: 222,
    treesPlanted: 71,
  },
  {
    id: 6,
    name: "Punjab Kings",
    logo: "PBKS",
    color: "#ED1B24",
    dotBallsPlayed: 256,
    treesPlanted: 83,
  },
  {
    id: 7,
    name: "Rajasthan Royals",
    logo: "RR",
    color: "#254AA5",
    dotBallsPlayed: 234,
    treesPlanted: 79,
  },
  {
    id: 8,
    name: "Sunrisers Hyderabad",
    logo: "SRH",
    color: "#FF822A",
    dotBallsPlayed: 267,
    treesPlanted: 88,
  },
  {
    id: 9,
    name: "Gujarat Titans",
    logo: "GT",
    color: "#1C1C1C",
    dotBallsPlayed: 211,
    treesPlanted: 68,
  },
  {
    id: 10,
    name: "Lucknow Super Giants",
    logo: "LSG",
    color: "#A72056",
    dotBallsPlayed: 198,
    treesPlanted: 65,
  },
];
