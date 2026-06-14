"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Html, OrbitControls, Sparkles } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

function useReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function PriceRail({ y = 0, active = 1 }) {
  const group = useRef(null);
  const reducedMotion = useReducedMotion();
  const tiers = useMemo(
    () => [
      { x: -2.55, height: 0.48, color: "#3B82F6" },
      { x: -1.25, height: 0.72, color: "#8B5CF6" },
      { x: 0.05, height: 1.05, color: "#10B981" },
      { x: 1.35, height: 1.36, color: "#F59E0B" },
      { x: 2.65, height: 1.7, color: "#10B981" },
    ],
    []
  );

  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.12;
  });

  return (
    <group ref={group} position={[0, y, 0]}>
      <mesh position={[0, -0.72, 0]} receiveShadow>
        <boxGeometry args={[6.4, 0.08, 1.25]} />
        <meshStandardMaterial color="#0f172a" roughness={0.55} metalness={0.2} />
      </mesh>
      {tiers.map((tier, index) => (
        <Float
          key={tier.x}
          speed={reducedMotion ? 0 : 1 + index * 0.16}
          rotationIntensity={0.05}
          floatIntensity={0.08}
        >
          <mesh
            castShadow
            receiveShadow
            position={[tier.x, -0.72 + tier.height / 2, 0]}
            scale={[0.82, tier.height, 0.82]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={tier.color}
              emissive={tier.color}
              emissiveIntensity={index <= active ? 0.18 : 0.04}
              roughness={0.38}
              metalness={0.22}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function BuyerNodes() {
  const group = useRef(null);
  const reducedMotion = useReducedMotion();
  const nodes = useMemo(
    () =>
      Array.from({ length: 22 }, (_, index) => {
        const angle = (index / 22) * Math.PI * 2;
        const radius = 2.35 + (index % 4) * 0.24;
        return {
          angle,
          radius,
          y: Math.sin(index * 1.7) * 0.42,
          color: index % 3 === 0 ? "#10B981" : index % 3 === 1 ? "#3B82F6" : "#F59E0B",
        };
      }),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y = clock.elapsedTime * 0.16;
  });

  return (
    <group ref={group} position={[0, 0.24, -0.1]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.82, 0.012, 12, 120]} />
        <meshStandardMaterial color="#64748B" transparent opacity={0.28} />
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
          <sphereGeometry args={[index % 5 === 0 ? 0.095 : 0.06, 18, 18]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.35}
            roughness={0.28}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 6]} intensity={1.8} castShadow />
      <pointLight position={[-3, 2, 2]} color="#8B5CF6" intensity={2.2} />
      <pointLight position={[3, -1, 2]} color="#10B981" intensity={1.6} />
      <group rotation={[-0.18, -0.48, 0]} position={[0.15, 0.05, 0]}>
        <BuyerNodes />
        <PriceRail active={3} />
      </group>
      <Sparkles count={38} scale={[6, 3, 3]} size={2.4} speed={0.35} color="#93C5FD" />
      <Html
        transform
        position={[1.72, 1.28, 0.35]}
        rotation={[0, -0.2, 0]}
        distanceFactor={6}
        className="manufacturing-scene__label"
      >
        <span>Price tier unlocked</span>
        <strong>-18%</strong>
      </Html>
      <Environment preset="city" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3.5}
      />
    </>
  );
}

export default function ManufacturingOrbitScene() {
  return (
    <div className="manufacturing-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [0, 1.15, 6.25], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <style jsx global>{`
        .manufacturing-scene {
          position: absolute;
          inset: -8% -4% -2% 40%;
          z-index: 0;
          opacity: 0.92;
          pointer-events: auto;
          touch-action: pan-y;
        }

        .manufacturing-scene canvas {
          cursor: grab;
        }

        .manufacturing-scene canvas:active {
          cursor: grabbing;
        }

        .manufacturing-scene__label {
          min-width: 118px;
          padding: 8px 10px;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.78);
          color: white;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.28);
          backdrop-filter: blur(16px);
          font-family: var(--font-body), sans-serif;
          line-height: 1.1;
          text-align: left;
        }

        .manufacturing-scene__label span,
        .manufacturing-scene__label strong {
          display: block;
        }

        .manufacturing-scene__label span {
          font-size: 0.56rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.64);
          white-space: nowrap;
        }

        .manufacturing-scene__label strong {
          margin-top: 3px;
          color: #34d399;
          font-size: 1.18rem;
          font-weight: 900;
          font-family: var(--font-heading), sans-serif;
        }

        @media (max-width: 980px) {
          .manufacturing-scene {
            inset: auto -18% 10% -18%;
            height: 48%;
            opacity: 0.36;
            pointer-events: none;
          }
        }

        @media (max-width: 640px) {
          .manufacturing-scene {
            height: 38%;
            bottom: 18%;
            opacity: 0.24;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .manufacturing-scene {
            pointer-events: none;
          }
        }
      `}</style>
    </div>
  );
}
