"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function usePrefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function FloatingCubeGroup() {
  const groupRef = useRef(null);
  const cubeRef = useRef(null);
  const particlesRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  // Mouse parallax interaction
  const mouse = useRef({ x: 0, y: 0 });

  useMemo(() => {
    if (typeof window === "undefined") return;
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    if (reduced) return;
    const time = clock.getElapsedTime();

    if (groupRef.current) {
      // Parallax effect
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.current.y * 0.15, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.current.x * 0.15, 0.05);
      
      // Floating effect
      groupRef.current.position.y = Math.sin(time * 0.6) * 0.12;
    }

    if (cubeRef.current) {
      cubeRef.current.rotation.x = time * 0.12;
      cubeRef.current.rotation.y = time * 0.18;
      cubeRef.current.rotation.z = time * 0.08;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.04;
    }
  });

  // Create a grid of smaller boxes representing "crowd merging"
  const smallBoxes = useMemo(() => {
    const boxes = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const radius = 1.3 + Math.sin(i * 1.5) * 0.2;
      boxes.push({
        position: [
          Math.cos(theta) * radius,
          Math.sin(theta * 2) * 0.3,
          Math.sin(theta) * radius,
        ],
        size: 0.15 + (i % 3) * 0.05,
        color: i % 3 === 0 ? "#FF6A00" : i % 3 === 1 ? "#FF8C24" : "#FFFFFF",
      });
    }
    return boxes;
  }, []);

  // Orbiting particles / points representing the buyers
  const particleNodes = useMemo(() => {
    const nodes = [];
    for (let i = 0; i < 45; i++) {
      const radius = 2.0 + Math.random() * 1.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      nodes.push({
        pos: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        ],
        size: 0.02 + Math.random() * 0.02,
      });
    }
    return nodes;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Central Premium Metallic/Glass Cube */}
      <mesh ref={cubeRef} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshStandardMaterial
          color="#111111"
          roughness={0.15}
          metalness={0.9}
        />
        {/* Core Glow effect inside */}
        <pointLight color="#FF6A00" intensity={3} distance={2.5} />
      </mesh>

      {/* Wireframe outline of central cube for high-tech look */}
      <mesh ref={cubeRef}>
        <boxGeometry args={[1.42, 1.42, 1.42]} />
        <meshBasicMaterial
          color="#FF6A00"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Surrounding merging product boxes */}
      {smallBoxes.map((box, i) => (
        <mesh key={i} position={box.position}>
          <boxGeometry args={[box.size, box.size, box.size]} />
          <meshStandardMaterial
            color={box.color}
            roughness={0.2}
            metalness={i % 2 === 0 ? 0.8 : 0.2}
            emissive={box.color === "#FF6A00" ? "#FF6A00" : "#000000"}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Floating particles */}
      <group ref={particlesRef}>
        {particleNodes.map((p, i) => (
          <mesh key={i} position={p.pos}>
            <sphereGeometry args={[p.size, 8, 8]} />
            <meshBasicMaterial color="#FF8C24" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function HeroCubeScene() {
  return (
    <div className="w-full h-full relative" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.5} />
        {/* Orange rim lighting */}
        <directionalLight position={[5, 5, -5]} intensity={3} color="#FF6A00" />
        <directionalLight position={[-5, 5, 5]} intensity={2.5} color="#FF8C24" />
        <pointLight position={[0, 4, 2]} color="#FFFFFF" intensity={1.5} />
        <spotLight
          position={[0, 5, 0]}
          intensity={2}
          angle={0.6}
          penumbra={1}
          color="#FF6A00"
        />
        
        <FloatingCubeGroup />
      </Canvas>

      {/* Overlay status tags */}
      <div className="absolute top-[18%] right-[5%] flex flex-col gap-1 px-4 py-2 border border-white/5 rounded-xl bg-neutral-950/85 text-white shadow-xl backdrop-blur-md">
        <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Batch Density</span>
        <strong className="text-sm text-green-400 font-display font-black">+42%</strong>
      </div>
      <div className="absolute bottom-[20%] left-[8%] flex flex-col gap-1 px-4 py-2 border border-white/5 rounded-xl bg-neutral-950/85 text-white shadow-xl backdrop-blur-md">
        <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Factory Price</span>
        <strong className="text-sm text-primary font-display font-black">Dropping Live</strong>
      </div>
    </div>
  );
}
