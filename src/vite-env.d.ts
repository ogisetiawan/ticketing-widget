/// <reference types="vite/client" />

declare module "*.json" {
  const value: unknown;
  export default value;
}

declare module "lottie-web" {
  export interface AnimationConfig {
    container: HTMLElement;
    renderer: "svg" | "canvas" | "html";
    loop?: boolean | number;
    autoplay?: boolean;
    animationData?: any;
    path?: string;
  }

  export interface AnimationItem {
    play(): void;
    pause(): void;
    stop(): void;
    destroy(): void;
    setSpeed(speed: number): void;
    setDirection(direction: number): void;
  }

  interface Lottie {
    loadAnimation(config: AnimationConfig): AnimationItem;
  }

  const lottie: Lottie;
  export default lottie;
  export type { AnimationItem, AnimationConfig };
}

