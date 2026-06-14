"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function usePrefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function FactoryCore() {
  const coreRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useFrame(({ clock }) => {
    if (!coreRef.current || reduced) return;
    coreRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.38) * 0.18;
    coreRef.current.position.y = Math.sin(clock.elapsedTime * 0.7) * 0.04;
  });

  return (
    <group ref={coreRef}>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[1.38, 0.9, 1.08]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.42} metalness={0.2} />
      </mesh>
      <mesh position={[-0.36, 0.86, 0]}>
        <boxGeometry args={[0.2, 0.58, 0.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.36} />
      </mesh>
      <mesh position={[0.08, 0.78, 0]}>
        <boxGeometry args={[0.22, 0.42, 0.22]} />
        <meshStandardMaterial color="#0f172a" roughness={0.36} />
      </mesh>
      <mesh position={[0.46, 0.12, 0.58]}>
        <boxGeometry args={[0.42, 0.42, 0.08]} />
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#ef4444"
          emissiveIntensity={0.38}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[-0.44, 0.12, 0.58]}>
        <boxGeometry args={[0.42, 0.42, 0.08]} />
        <meshStandardMaterial
          color="#fecaca"
          emissive="#ef4444"
          emissiveIntensity={0.24}
          roughness={0.22}
        />
      </mesh>
    </group>
  );
}

function PriceSteps() {
  const groupRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const steps = useMemo(
    () => [
      { x: -2.55, y: -1.0, h: 0.34, color: "#f8fafc" },
      { x: -1.45, y: -0.82, h: 0.58, color: "#fca5a5" },
      { x: -0.35, y: -0.6, h: 0.88, color: "#ef4444" },
      { x: 0.75, y: -0.36, h: 1.18, color: "#fbbf24" },
      { x: 1.85, y: -0.1, h: 1.52, color: "#dc2626" },
    ],
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current || reduced) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.07;
  });

  return (
    <group ref={groupRef} position={[0, -0.22, -0.15]}>
      {steps.map((step, index) => (
        <mesh key={step.x} position={[step.x, step.y + step.h / 2, 0]} scale={[0.78, step.h, 0.42]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={step.color}
            emissive={step.color}
            emissiveIntensity={0.14 + index * 0.035}
            roughness={0.32}
            metalness={0.18}
          />
        </mesh>
      ))}
    </group>
  );
}

function BuyerOrbit() {
  const groupRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const nodes = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => {
        const angle = (index / 28) * Math.PI * 2;
        const radius = 2.34 + (index % 4) * 0.11;
        return {
          angle,
          radius,
          y: -0.05 + Math.sin(index * 1.23) * 0.32,
          size: index % 7 === 0 ? 0.085 : 0.052,
          color: index % 4 === 0 ? "#ef4444" : index % 4 === 1 ? "#f8fafc" : index % 4 === 2 ? "#f59e0b" : "#22c55e",
        };
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current || reduced) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.2;
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.46, 0.012, 10, 120]} />
        <meshBasicMaterial color="#64748b" transparent opacity={0.28} />
      </mesh>
      {nodes.map((node, index) => (
        <mesh
          key={index}
          position={[
            Math.cos(node.angle) * node.radius,
            node.y,
            Math.sin(node.angle) * node.radius,
          ]}
        >
          <sphereGeometry args={[node.size, 16, 16]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.34}
            roughness={0.24}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  const sceneRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useFrame(({ clock }) => {
    if (!sceneRef.current || reduced) return;
    sceneRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.18) * 0.02;
  });

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 4, 5]} intensity={2.4} />
      <pointLight position={[-3, 1.5, 2]} color="#ef4444" intensity={1.8} />
      <pointLight position={[2.4, -1.4, 2.2]} color="#ffffff" intensity={1.2} />
      <group ref={sceneRef} rotation={[-0.2, -0.34, 0]} position={[0.25, 0.04, 0]}>
        <BuyerOrbit />
        <FactoryCore />
        <PriceSteps />
      </group>
    </>
  );
}

export default function ManufacturingOrbitScene() {
  return (
    <div className="manufacturing-scene" aria-hidden="true">
      <Canvas
        dpr={[1.35, 2]}
        camera={{ position: [0, 0.65, 5.8], fov: 38 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.setClearAlpha(0);
        }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        <Scene />
      </Canvas>
      <div className="manufacturing-scene__tag manufacturing-scene__tag--top">
        <span>Batch density</span>
        <strong>+42%</strong>
      </div>
      <div className="manufacturing-scene__tag manufacturing-scene__tag--bottom">
        <span>Factory price</span>
        <strong>dropping live</strong>
      </div>
      <style jsx global>{`
        .manufacturing-scene {
          position: absolute;
          top: 132px;
          right: max(22px, 3vw);
          width: min(27vw, 350px);
          height: min(48vh, 400px);
          min-height: 320px;
          z-index: 1;
          pointer-events: none;
          opacity: 1;
          filter: none;
        }

        .manufacturing-scene canvas {
          width: 100% !important;
          height: 100% !important;
          filter: none;
          image-rendering: auto;
        }

        .manufacturing-scene__tag {
          position: absolute;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 10px 12px;
          border: 1px solid color-mix(in srgb, var(--accent-primary) 22%, var(--border-default));
          border-radius: var(--radius-lg);
          background: color-mix(in srgb, var(--bg-surface) 78%, transparent);
          color: var(--text-primary);
          box-shadow: var(--shadow-premium);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          font-family: var(--font-body), sans-serif;
        }

        .manufacturing-scene__tag--top {
          top: 14%;
          right: 2%;
        }

        .manufacturing-scene__tag--bottom {
          left: 4%;
          bottom: 12%;
        }

        .manufacturing-scene__tag span {
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-tertiary);
          white-space: nowrap;
        }

        .manufacturing-scene__tag strong {
          font-family: var(--font-heading), sans-serif;
          font-size: 1rem;
          line-height: 1;
          color: var(--accent-success);
          font-weight: 900;
          white-space: nowrap;
        }

        @media (max-width: 1180px) {
          .manufacturing-scene {
            width: min(42vw, 430px);
            opacity: 0.28;
            right: -10vw;
          }

          .manufacturing-scene__tag {
            display: none;
          }
        }

        @media (max-width: 760px) {
          .manufacturing-scene {
            top: 120px;
            right: -28vw;
            width: 92vw;
            height: 360px;
            min-height: 320px;
            opacity: 0.24;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .manufacturing-scene {
            opacity: 0.24;
          }
        }
      `}</style>
    </div>
  );
}
