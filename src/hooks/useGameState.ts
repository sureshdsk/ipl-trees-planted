
import { useState } from "react";

export interface GameState {
  score: number;
  treesPlanted: number;
  dotBallsPlayed: number;
  isPaused: boolean;
  autoPlay: boolean;
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    treesPlanted: 0,
    dotBallsPlayed: 0,
    isPaused: false,
    autoPlay: true,
  });

  const toggleAutoPlay = () => {
    setGameState((prev) => ({
      ...prev,
      autoPlay: !prev.autoPlay,
    }));
  };

  const updateTreeStats = () => {
    setGameState(prev => ({
      ...prev,
      treesPlanted: prev.treesPlanted + 1,
      dotBallsPlayed: prev.dotBallsPlayed + Math.floor(Math.random() * 3) + 1
    }));
  };

  return {
    gameState,
    toggleAutoPlay,
    updateTreeStats
  };
};
