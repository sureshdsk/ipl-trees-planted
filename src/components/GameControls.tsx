
import React from 'react';
import { GameState } from '../hooks/useGameState';

interface GameControlsProps {
  gameState: GameState;
  onToggleAutoPlay: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ gameState, onToggleAutoPlay }) => {
  return (
    <div className="absolute top-4 left-4 bg-white/80 p-4 rounded-lg shadow-md backdrop-blur-sm">
      <div className="text-xl font-bold text-green-800 mb-2">Pac-Tree</div>
      <button
        onClick={onToggleAutoPlay}
        className={`px-4 py-2 rounded-md ${
          gameState.autoPlay ? "bg-green-600 text-white" : "bg-gray-200"
        } transition-colors duration-200`}
      >
        {gameState.autoPlay ? "Auto Mode: ON" : "Auto Mode: OFF"}
      </button>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="bg-green-100 p-2 rounded">
          <div className="text-lg font-semibold text-green-800">{gameState.treesPlanted}</div>
          <div className="text-xs text-green-700">Trees Planted</div>
        </div>
        <div className="bg-blue-100 p-2 rounded">
          <div className="text-lg font-semibold text-blue-800">{gameState.dotBallsPlayed}</div>
          <div className="text-xs text-blue-700">Dot Balls</div>
        </div>
        <div className="bg-yellow-100 p-2 rounded col-span-2">
          <div className="text-lg font-semibold text-yellow-800">{gameState.score}</div>
          <div className="text-xs text-yellow-700">Score</div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
