
import { useRef } from "react";
import { useGameState } from "../hooks/useGameState";
import { useThreeScene } from "../hooks/useThreeScene";
import GameControls from "./GameControls";

// Make TypeScript aware of the THREE property on window
declare global {
  interface Window {
    THREE: any;
  }
}

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { gameState, toggleAutoPlay, updateTreeStats } = useGameState();

  useThreeScene({
    canvasRef,
    containerRef,
    gameState,
    updateTreeStats
  });

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      <GameControls gameState={gameState} onToggleAutoPlay={toggleAutoPlay} />
    </div>
  );
};

export default Game;
