
import Game from "../components/Game";
import StatsPanel from "../components/StatsPanel";
import { useEffect, useState } from "react";

const Index = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple loading effect
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-green-100 to-blue-100">
        <div className="w-16 h-16 mb-4 rounded-full border-4 border-green-600 border-t-transparent animate-spin"></div>
        <h1 className="text-2xl font-bold text-green-800">Loading Pac-Tree...</h1>
        <p className="text-green-600 mt-2">Planting virtual trees for a better world</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex-1 relative">
        <Game />
      </div>
      <StatsPanel />
      
      {/* Floating help tooltip */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow-lg max-w-sm backdrop-blur-sm">
        <h3 className="font-bold text-green-800 mb-1">About Pac-Tree</h3>
        <p className="text-sm text-gray-700">
          Watch as our eco-friendly Pacman plants trees while collecting dots! 
          Each dot represents a cricket dot ball, helping IPL teams contribute to reforestation.
        </p>
      </div>
    </div>
  );
};

export default Index;
