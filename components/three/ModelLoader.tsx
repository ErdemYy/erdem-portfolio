"use client";

import { Component, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

/** Faint wireframe stand-in shown while a model streams in. */
export function ModelLoaderFallback({ size = 2 }: { size?: number }) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.4;
  });
  return (
    <mesh ref={ref} position={[0, size / 2, 0]}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color="#59606e" wireframe transparent opacity={0.25} />
    </mesh>
  );
}

/** Same footprint, static — shown if a model fails so the site never breaks. */
export function ModelErrorFallback({ size = 2 }: { size?: number }) {
  return (
    <mesh position={[0, size / 2, 0]}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color="#ff5b2e" wireframe transparent opacity={0.18} />
    </mesh>
  );
}

type Props = {
  fallback: ReactNode;
  label: string;
  children: ReactNode;
  onError?: () => void;
};
type State = { failed: boolean };

/** Catches loader/parse errors for ONE model; the rest of the scene lives on. */
export class ModelErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn(`[3D] "${this.props.label}" failed to load:`, error);
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
