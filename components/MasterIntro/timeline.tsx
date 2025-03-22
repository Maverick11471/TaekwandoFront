/* eslint-disable react/no-unescaped-entities */

"use client";
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start -70%", "end 10%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const translateYTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [150, height]
  );

  return (
    <div
      className="w-full min-h-[200vh] lg:min-h-[300vh] bg-black dark:bg-neutral-950 font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10 text-center">
        <h2 className="text-[4vw]  text-white dark:text-white max-w-4xl mx-auto mt-30">
          태권도를 학문적으로 연구하고, <br />
          대회에서 실력까지 입증한 관장!
        </h2>
        <p className="text-[2vw] text-white dark:text-neutral-300  mx-auto mt-30">
          " 끊임없는 노력으로 국내대회에서 다수 입상하며
          <br />
          꾸준한 연구를 통해 태권도를 가르치는 관장님은
          <br />
          아이의 잠재력을 끌어내기 위해 체계적인 교육을 제공합니다.
          <br />
          단순한 기술을 넘어, 인내와 책임감을 가르치며,
          <br />
          아이의 미래를 밝히는 길로 안내합니다. "
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20 ">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-center pt-10 md:pt-40 md:gap-10 "
          >
            <div className=" flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-white dark:text-white ">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-white dark:text-white">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: "100%",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              translateY: translateYTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[50%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
