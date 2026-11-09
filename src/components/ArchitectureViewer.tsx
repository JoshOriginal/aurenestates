import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { RotateCcw } from 'lucide-react'

function HouseModel() {
  const windowPositions: [number, number, number][] = [
    [-1.4, 1.25, 1.27], [-0.25, 1.25, 1.27], [0.9, 1.25, 1.27],
    [1.5, 1.25, 0.55], [1.5, 1.25, -0.55], [-1.4, 1.25, -1.27],
  ]
  return (
    <group position={[0, -0.6, 0]}>
      <mesh position={[0, -0.08, 0]} receiveShadow><boxGeometry args={[5.3, 0.18, 4.2]} /><meshStandardMaterial color="#d8d4c8" /></mesh>
      <mesh position={[-0.5, 1, 0]} castShadow receiveShadow><boxGeometry args={[3.6, 2, 2.8]} /><meshStandardMaterial color="#e7e4dc" /></mesh>
      <mesh position={[1.2, 1, -0.1]} castShadow receiveShadow><boxGeometry args={[2.1, 2, 2.6]} /><meshStandardMaterial color="#c9c4b6" /></mesh>
      <mesh position={[-0.35, 2.08, 0]} castShadow><boxGeometry args={[3.9, 0.16, 3.08]} /><meshStandardMaterial color="#35443d" /></mesh>
      <mesh position={[1.2, 2.08, -0.1]} castShadow><boxGeometry args={[2.35, 0.16, 2.9]} /><meshStandardMaterial color="#35443d" /></mesh>
      <mesh position={[-0.65, 0.58, 1.43]} castShadow><boxGeometry args={[0.68, 1.18, 0.06]} /><meshStandardMaterial color="#78664e" /></mesh>
      {windowPositions.map((position, index) => <mesh key={index} position={position}><boxGeometry args={[0.72, 0.72, 0.08]} /><meshStandardMaterial color="#9bb9b5" metalness={0.15} roughness={0.22} /></mesh>)}
      <mesh position={[-1.95, 0.28, 0.7]} castShadow><boxGeometry args={[0.14, 0.55, 0.14]} /><meshStandardMaterial color="#777e69" /></mesh>
      <mesh position={[-1.95, 0.65, 0.7]} castShadow><sphereGeometry args={[0.44, 12, 8]} /><meshStandardMaterial color="#62745b" /></mesh>
      <mesh position={[2.25, 0.26, 0.85]} castShadow><boxGeometry args={[0.14, 0.5, 0.14]} /><meshStandardMaterial color="#777e69" /></mesh>
      <mesh position={[2.25, 0.58, 0.85]} castShadow><sphereGeometry args={[0.38, 12, 8]} /><meshStandardMaterial color="#758367" /></mesh>
    </group>
  )
}

export default function ArchitectureViewer() {
  const controls = useRef<OrbitControlsImpl>(null)
  return (
    <div className="architecture-viewer">
      <Canvas shadows camera={{ position: [6, 4.4, 7], fov: 35 }} fallback={<div className="viewer-fallback">Interactive model unavailable on this device.</div>}>
        <color attach="background" args={['#d9dfd7']} />
        <ambientLight intensity={1.15} />
        <directionalLight position={[4, 8, 5]} intensity={2.1} castShadow shadow-mapSize={[1024, 1024]} />
        <Suspense fallback={null}><HouseModel /></Suspense>
        <OrbitControls ref={controls} makeDefault minDistance={5} maxDistance={13} maxPolarAngle={Math.PI / 2.05} target={[0, 0.7, 0]} />
      </Canvas>
      <div className="viewer-label"><span>Procedural concept model</span><span>Drag to orbit · Scroll to zoom</span></div>
      <button className="viewer-reset icon-button" type="button" onClick={() => controls.current?.reset()} aria-label="Reset model view" title="Reset model view"><RotateCcw size={16} /></button>
    </div>
  )
}