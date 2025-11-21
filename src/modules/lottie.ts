import lottie from "lottie-web";
import type { AnimationItem } from "lottie-web";
// @ts-ignore - Vite handles JSON imports
import animationData from "../image/bm-ticketing-support.json";

export const LottieModule = (() => {
  let animation: AnimationItem | null = null;

  const init = (container: HTMLElement): void => {
    if (animation) {
      animation.destroy();
    }

    animation = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData as any,
    });
  };

  const play = (): void => {
    if (animation) {
      animation.play();
    }
  };

  const pause = (): void => {
    if (animation) {
      animation.pause();
    }
  };

  const destroy = (): void => {
    if (animation) {
      animation.destroy();
      animation = null;
    }
  };

  return {
    init,
    play,
    pause,
    destroy,
  };
})();

