import { useEffect, useRef, useState } from "react";
import { teams } from "../data/teams";

// Make TypeScript aware of the THREE property on window
declare global {
  interface Window {
    THREE: any;
  }
}

interface GameState {
  score: number;
  treesPlanted: number;
  dotBallsPlayed: number;
  isPaused: boolean;
  autoPlay: boolean;
}

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    treesPlanted: 0,
    dotBallsPlayed: 0,
    isPaused: false,
    autoPlay: true,
  });

  // Toggle auto play mode
  const toggleAutoPlay = () => {
    setGameState((prev) => ({
      ...prev,
      autoPlay: !prev.autoPlay,
    }));
  };

  // Initialize Three.js scene
  useEffect(() => {
    // We need to load Three.js from a script tag since we couldn't install it as a dependency
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.min.js";
    script.async = true;
    script.onload = initializeGame;
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGame = () => {
    if (!canvasRef.current || !containerRef.current || !window.THREE) return;
    const THREE = window.THREE;
    
    // Get the container dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Create modern scene with fog for depth
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a); // Darker background
    scene.fog = new THREE.Fog(0x1a1a1a, 15, 30); // Add fog for depth

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 15, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Add point lights for better atmosphere
    const pointLight1 = new THREE.PointLight(0x00ff00, 0.5, 15);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0000ff, 0.5, 15);
    pointLight2.position.set(-5, 5, -5);
    scene.add(pointLight2);

    // Modern grid with glow
    const gridHelper = new THREE.GridHelper(20, 20, 0x404040, 0x404040);
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x404040,
      transparent: true,
      opacity: 0.3,
    });
    gridHelper.material = gridMaterial;
    scene.add(gridHelper);

    // Get the top team's color for Pacman
    const topTeam = [...teams].sort((a, b) => b.treesPlanted - a.treesPlanted)[0];
    const pacmanColor = topTeam ? topTeam.color : '#FFFF00';

    // Create modern Pacman with emissive material
    const pacmanGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const pacmanMaterial = new THREE.MeshStandardMaterial({ 
      color: pacmanColor,
      emissive: pacmanColor,
      emissiveIntensity: 0.2,
      metalness: 0.3,
      roughness: 0.4,
    });
    const pacman = new THREE.Mesh(pacmanGeometry, pacmanMaterial);
    pacman.position.set(0, 0.5, 0);
    pacman.castShadow = true;
    scene.add(pacman);

    // Create a more beautiful tree function with modern materials
    const createTree = (x: number, z: number) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);
      
      // Modern trunk with better materials
      const trunkGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.7, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4a3728,
        roughness: 0.7,
        metalness: 0.2,
      });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 0.35;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      tree.add(trunk);
      
      const createLeaves = (y: number, size: number, color: number) => {
        const leavesGeometry = new THREE.ConeGeometry(size, size * 1.2, 8);
        const leavesMaterial = new THREE.MeshStandardMaterial({ 
          color: color,
          roughness: 0.6,
          metalness: 0.1,
          emissive: color,
          emissiveIntensity: 0.05,
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = y;
        leaves.castShadow = true;
        leaves.receiveShadow = true;
        return leaves;
      };
      
      // Modern color palette for trees
      trunk.add(createLeaves(0.5, 0.35, 0x2d5a27));
      trunk.add(createLeaves(0.7, 0.3, 0x3a7634));
      trunk.add(createLeaves(0.9, 0.2, 0x4c9445));
      
      // Smooth grow animation
      tree.scale.set(0.01, 0.01, 0.01);
      
      const startTime = Date.now();
      const growTree = () => {
        const elapsed = Date.now() - startTime;
        const growFactor = Math.min(1, elapsed / 1000);
        
        tree.scale.set(growFactor, growFactor, growFactor);
        
        if (growFactor < 1) {
          requestAnimationFrame(growTree);
        }
      };
      
      growTree();
      
      tree.rotation.y = Math.random() * Math.PI * 2;
      scene.add(tree);
      
      // Update game state
      setGameState(prev => ({
        ...prev,
        treesPlanted: prev.treesPlanted + 1,
        dotBallsPlayed: prev.dotBallsPlayed + Math.floor(Math.random() * 3) + 1
      }));
      
      // Update IPL team stats randomly
      const randomTeamIndex = Math.floor(Math.random() * teams.length);
      teams[randomTeamIndex].treesPlanted += 1;
      teams[randomTeamIndex].dotBallsPlayed += Math.floor(Math.random() * 3) + 1;
      
      return tree;
    };

    // Auto play logic
    const gameBoard: { [key: string]: any } = {};
    let direction = new THREE.Vector3(1, 0, 0);
    
    const autoPlayInterval = setInterval(() => {
      if (gameState.autoPlay && !gameState.isPaused) {
        // Occasionally change direction
        if (Math.random() < 0.1) {
          const randomDir = Math.floor(Math.random() * 4);
          switch (randomDir) {
            case 0: direction = new THREE.Vector3(1, 0, 0); break; // right
            case 1: direction = new THREE.Vector3(-1, 0, 0); break; // left
            case 2: direction = new THREE.Vector3(0, 0, 1); break; // up
            case 3: direction = new THREE.Vector3(0, 0, -1); break; // down
          }
        }
        
        // Move pacman
        pacman.position.add(direction.clone().multiplyScalar(0.2));
        
        // Keep pacman within bounds
        pacman.position.x = Math.max(-10, Math.min(10, pacman.position.x));
        pacman.position.z = Math.max(-10, Math.min(10, pacman.position.z));
        
        // Plant a tree with 10% chance when moving
        if (Math.random() < 0.1) {
          const posKey = `${Math.round(pacman.position.x)}_${Math.round(pacman.position.z)}`;
          
          // Only plant if no tree exists at this position
          if (!gameBoard[posKey]) {
            gameBoard[posKey] = createTree(
              Math.round(pacman.position.x), 
              Math.round(pacman.position.z)
            );
          }
        }
      }
    }, 100);
    
    // Render loop
    function animate() {
      requestAnimationFrame(animate);

      // Smooth automatic rotation
      if (!gameState.isPaused && gameState.autoPlay) {
        pacman.rotation.y += 0.02;
        pointLight1.position.x = Math.sin(Date.now() * 0.001) * 5;
        pointLight1.position.z = Math.cos(Date.now() * 0.001) * 5;
        pointLight2.position.x = Math.sin(Date.now() * 0.001 + Math.PI) * 5;
        pointLight2.position.z = Math.cos(Date.now() * 0.001 + Math.PI) * 5;
      }

      renderer.render(scene, camera);
    }
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(autoPlayInterval);
    };
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {/* Controls overlay */}
      <div className="absolute top-4 left-4 bg-white/80 p-4 rounded-lg shadow-md backdrop-blur-sm">
        <div className="text-xl font-bold text-green-800 mb-2">Pac-Tree</div>
        <button
          onClick={toggleAutoPlay}
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
    </div>
  );
};

export default Game;
