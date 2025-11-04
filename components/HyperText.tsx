
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { cn } from "../utils/cn";

interface HyperTextProps {
  text: string;
  duration?: number;
  framerProps?: Variants;
  className?: string;
  animateOnLoad?: boolean;
}

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export function HyperText({
  text,
  duration = 800,
  framerProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 3 },
  },
  className,
  animateOnLoad = true,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(text.split(""));
  const [trigger, setTrigger] = useState(false);
  const interations = useRef(0);
  const isFirstRender = useRef(true);
  const isAnimating = useRef(false);

  const triggerAnimation = () => {
    if (isAnimating.current) return;
    setTrigger(true);
  };

  useEffect(() => {
    let intervalId: number | undefined;

    const runAnimation = () => {
      isAnimating.current = true;
      interations.current = 0;
      if (intervalId) clearInterval(intervalId);

      intervalId = window.setInterval(
        () => {
          if (interations.current < text.length) {
            setDisplayText((t) =>
              t.map((l, i) =>
                l === " "
                  ? l
                  : i <= interations.current
                  ? text[i]
                  : alphabets[getRandomInt(26)],
              ),
            );
            interations.current = interations.current + 0.1;
          } else {
            setDisplayText(text.split(""));
            setTrigger(false);
            isAnimating.current = false;
            if(intervalId) clearInterval(intervalId);
          }
        },
        duration / (text.length * 10),
      );
    }

    if ((animateOnLoad && isFirstRender.current) || trigger) {
        if(animateOnLoad && isFirstRender.current) isFirstRender.current = false;
        runAnimation();
    }
    
    return () => {
      if(intervalId) clearInterval(intervalId);
    };
  }, [text, duration, animateOnLoad, trigger]);

  return (
    <div
      className="flex scale-100 cursor-default overflow-hidden py-2"
      onMouseEnter={triggerAnimation}
    >
      <AnimatePresence mode="wait">
        {displayText.map((letter, i) => (
          <motion.span
            key={i}
            className={cn("font-mono", letter === " " ? "w-3" : "", className)}
            {...framerProps}
          >
            {letter.toUpperCase()}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
