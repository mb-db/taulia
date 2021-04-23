import { useEffect, useState } from 'react';

const easeFunctions = {
  linear: n => n,
  // https://easings.net/
  easeOutSine: n => Math.sin((n * Math.PI) / 2),
  easeOutCubic: n => 1 - (1 - n) ** 3,
  easeOutQuint: n => 1 - (1 - n) ** 5,
};

// https://usehooks.com/useAnimation/
const useAnimationTimer = (animate, duration, delay) => {
  const [elapsed, setTime] = useState(0);

  useEffect(() => {
    let animationFrame;
    let timerStop;
    let start;
    let timerDelay;

    const loop = () => {
      // eslint-disable-next-line no-use-before-define
      animationFrame = requestAnimationFrame(onFrame);
    };

    const onFrame = () => {
      setTime(Date.now() - start);
      loop();
    };

    const onStart = () => {
      timerStop = setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        setTime(Date.now() - start);
      }, duration);
      start = Date.now();
      loop();
    };

    if (animate) {
      timerDelay = setTimeout(onStart, delay);
    }
    return () => {
      clearTimeout(timerStop);
      clearTimeout(timerDelay);
      cancelAnimationFrame(animationFrame);
    };
  }, [animate, duration, delay]);

  return elapsed;
};

const useAnimation = (
  animate = true,
  duration = 500,
  delay = 0,
  easeFunction = easeFunctions.linear
) => {
  const elapsed = useAnimationTimer(animate, duration, delay);
  const n = Math.min(1, elapsed / duration);
  return easeFunction(n);
};

export { useAnimation, easeFunctions };
