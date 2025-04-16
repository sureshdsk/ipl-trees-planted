
import { useState, useEffect } from "react";
import { teams, TeamStats } from "../data/teams";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

const StatsPanel = () => {
  const [totalTrees, setTotalTrees] = useState(0);
  const [totalDotBalls, setTotalDotBalls] = useState(0);
  const [previousRanks, setPreviousRanks] = useState<{ [key: number]: number }>({});
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

  // Sort teams and track ranking changes
  const sortedTeams = [...teams].sort((a, b) => {
    if (activeTab === 'trees') {
      return b.treesPlanted - a.treesPlanted;
    } else if (activeTab === 'dots') {
      return b.dotBallsPlayed - a.dotBallsPlayed;
    }
    return (b.treesPlanted + b.dotBallsPlayed) - (a.treesPlanted + a.dotBallsPlayed);
  });

  // Update previous ranks when sorting changes
  useEffect(() => {
    const newRanks: { [key: number]: number } = {};
    sortedTeams.forEach((team, index) => {
      if (previousRanks[team.id] === undefined) {
        newRanks[team.id] = index;
      } else {
        newRanks[team.id] = previousRanks[team.id];
      }
    });
    setPreviousRanks(newRanks);
  }, [activeTab]);

  return (
    <div className="w-96 h-full bg-white/20 backdrop-blur-md p-6 overflow-hidden border-l border-green-800/20 shadow-xl">
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
      
      <ScrollArea className="h-[calc(100vh-280px)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Trees</TableHead>
              <TableHead className="text-right">Dots</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTeams.map((team, index) => {
              const previousRank = previousRanks[team.id] || index;
              const rankChange = previousRank - index;
              
              return (
                <TableRow key={team.id} className="hover:bg-white/40">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      {index + 1}
                      {rankChange > 0 && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {rankChange < 0 && <TrendingDown className="w-4 h-4 text-red-500" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                        style={{ backgroundColor: team.color }}
                      >
                        {team.logo}
                      </div>
                      <span className="font-medium">{team.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-700">
                    {team.treesPlanted}
                  </TableCell>
                  <TableCell className="text-right font-medium text-blue-700">
                    {team.dotBallsPlayed}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default StatsPanel;
