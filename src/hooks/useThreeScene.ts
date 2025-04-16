
import { useEffect, RefObject } from 'react';
import { teams } from "../data/teams";
import { createTree } from "../utils/TreeGenerator";

interface UseThreeSceneProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  containerRef: RefObject<HTMLDivElement>;
  gameState: {
    autoPlay: boolean;
    isPaused: boolean;
  };
  updateTreeStats: () => void;
}

export const useThreeScene = ({ canvasRef, containerRef, gameState, updateTreeStats }: UseThreeSceneProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.159.0/three.min.js";
    script.async = true;
    script.onload = initializeGame;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGame = () => {
    if (!canvasRef.current || !containerRef.current || !window.THREE) return;
    const THREE = window.THREE;
    
    // Get container dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    scene.fog = new THREE.Fog(0x1a1a1a, 15, 30);

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
    
    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x00ff00, 0.5, 15);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0000ff, 0.5, 15);
    pointLight2.position.set(-5, 5, -5);
    scene.add(pointLight2);

    // Grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x404040, 0x404040);
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x404040,
      transparent: true,
      opacity: 0.3,
    });
    gridHelper.material = gridMaterial;
    scene.add(gridHelper);

    // Get top team's color for Pacman
    const topTeam = [...teams].sort((a, b) => b.treesPlanted - a.treesPlanted)[0];
    const pacmanColor = topTeam ? topTeam.color : '#FFFF00';

    // Create Pacman
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

    // Game state
    const gameBoard: { [key: string]: any } = {};
    let direction = new THREE.Vector3(1, 0, 0);
    
    const autoPlayInterval = setInterval(() => {
      if (gameState.autoPlay && !gameState.isPaused) {
        // Change direction randomly
        if (Math.random() < 0.1) {
          const randomDir = Math.floor(Math.random() * 4);
          switch (randomDir) {
            case 0: direction = new THREE.Vector3(1, 0, 0); break;
            case 1: direction = new THREE.Vector3(-1, 0, 0); break;
            case 2: direction = new THREE.Vector3(0, 0, 1); break;
            case 3: direction = new THREE.Vector3(0, 0, -1); break;
          }
        }
        
        // Move pacman
        pacman.position.add(direction.clone().multiplyScalar(0.2));
        pacman.position.x = Math.max(-10, Math.min(10, pacman.position.x));
        pacman.position.z = Math.max(-10, Math.min(10, pacman.position.z));
        
        // Plant trees randomly
        if (Math.random() < 0.1) {
          const posKey = `${Math.round(pacman.position.x)}_${Math.round(pacman.position.z)}`;
          if (!gameBoard[posKey]) {
            gameBoard[posKey] = createTree(scene, {
              x: Math.round(pacman.position.x),
              z: Math.round(pacman.position.z)
            }, THREE);
            updateTreeStats();
          }
        }
      }
    }, 100);
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

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
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(autoPlayInterval);
    };
  };
};
