"use client";
import React, { useRef } from "react";
import {
  useScroll,
  useTransform,
  useSpring,
  motion,
  MotionValue,
} from "motion/react";
import { useIsomorphicReducedMotion } from "@/lib/use-reduced-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  // Smooth the scroll-linked progress so fast scrolling glides instead of
  // snapping/jittering through the 3D transform.
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const reduced = useIsomorphicReducedMotion();

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  // Under reduced-motion, feed constant values so the scroll-linked 3D tilt,
  // scale and translate do not move (scroll-coupled rotation is a vestibular
  // trigger). Hooks stay unconditional.
  const rotate = useTransform(progress, [0, 1], reduced ? [0, 0] : [20, 0]);
  const scale = useTransform(
    progress,
    [0, 1],
    reduced ? [1, 1] : scaleDimensions(),
  );
  const translate = useTransform(
    progress,
    [0, 1],
    reduced ? [0, 0] : [0, -100],
  );

  return (
    <div
      className="h-[44rem] md:h-[58rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[26rem] md:h-[38rem] w-full border-[6px] border-surface-dark p-2 md:p-4 bg-surface-dark rounded-[28px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-secondary p-2 md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
