
import { teams } from "../data/teams";

export const createTree = (scene: THREE.Scene, position: { x: number, z: number }, THREE: any) => {
  const tree = new THREE.Group();
  tree.position.set(position.x, 0, position.z);
  
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

  // Update IPL team stats randomly
  const randomTeamIndex = Math.floor(Math.random() * teams.length);
  teams[randomTeamIndex].treesPlanted += 1;
  teams[randomTeamIndex].dotBallsPlayed += Math.floor(Math.random() * 3) + 1;
  
  return tree;
};
