import lottie from "lottie-web";
// @ts-ignore - Vite handles JSON imports
import animationData from "../image/bm-ticketing-support.json";
export const LottieModule = (() => {
    let animation = null;
    const init = (container) => {
        if (animation) {
            animation.destroy();
        }
        animation = lottie.loadAnimation({
            container,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: animationData,
        });
    };
    const play = () => {
        if (animation) {
            animation.play();
        }
    };
    const pause = () => {
        if (animation) {
            animation.pause();
        }
    };
    const destroy = () => {
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
