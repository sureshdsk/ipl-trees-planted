
import { useState, useEffect } from "react";
import { teams, TeamStats } from "../data/teams";

const StatsPanel = () => {
  const [totalTrees, setTotalTrees] = useState(0);
  const [totalDotBalls, setTotalDotBalls] = useState(0);
  const [activeTab, setActiveTab] = useState<'all'|'trees'|'dots'>('all');
  
  // Calculate totals - update dynamically
  useEffect(() => {
    const updateTotals = () => {
      const treesSum = teams.reduce((sum, team) => sum + team.treesPlanted, 0);
      const dotBallsSum = teams.reduce((sum, team) => sum + team.dotBallsPlayed, 0);
      setTotalTrees(treesSum);
      setTotalDotBalls(dotBallsSum);
    };
    
    updateTotals();
    const interval = setInterval(updateTotals, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sort teams based on active tab
  const sortedTeams = [...teams].sort((a, b) => {
    if (activeTab === 'trees') {
      return b.treesPlanted - a.treesPlanted;
    } else if (activeTab === 'dots') {
      return b.dotBallsPlayed - a.dotBallsPlayed;
    }
    return (b.treesPlanted + b.dotBallsPlayed) - (a.treesPlanted + a.dotBallsPlayed);
  });

  return (
    <div className="w-80 h-full bg-white/20 backdrop-blur-md p-6 overflow-y-auto border-l border-green-800/20 shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-green-800">IPL Green Stats</h2>
      
      <div className="mb-6 bg-green-50 p-4 rounded-lg shadow-inner">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center bg-green-100 rounded p-2">
            <div className="text-4xl font-bold text-green-600">{totalTrees}</div>
            <div className="text-sm text-green-700">Trees Planted</div>
          </div>
          <div className="text-center bg-blue-100 rounded p-2">
            <div className="text-4xl font-bold text-blue-600">{totalDotBalls}</div>
            <div className="text-sm text-blue-700">Dot Balls</div>
          </div>
        </div>
      </div>
      
      <div className="flex mb-4 bg-white rounded-lg overflow-hidden">
        <button 
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'all' ? 'bg-green-600 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'trees' ? 'bg-green-600 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => setActiveTab('trees')}
        >
          Trees
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'dots' ? 'bg-green-600 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => setActiveTab('dots')}
        >
          Dots
        </button>
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-green-800">IPL Teams</h3>
      <div className="space-y-4">
        {sortedTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
};

const TeamCard = ({ team }: { team: TeamStats }) => {
  return (
    <div className="bg-white/80 rounded-lg p-3 shadow-sm">
      <div className="flex items-center">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: team.color }}
        >
          {team.logo}
        </div>
        <div className="ml-3">
          <h4 className="font-semibold">{team.name}</h4>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
        <div className="flex flex-col">
          <span className="text-green-700 font-medium">{team.treesPlanted}</span>
          <span className="text-xs text-gray-600">Trees</span>
        </div>
        <div className="flex flex-col">
          <span className="text-blue-700 font-medium">{team.dotBallsPlayed}</span>
          <span className="text-xs text-gray-600">Dot Balls</span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
