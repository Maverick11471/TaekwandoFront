import React, { useLayoutEffect } from "react";
import { BentoGrid, BentoGridItem } from "./bento-grid";
import {
  IconMoodSmileBeam,
  IconClockHour2,
  IconUsersGroup,
} from "@tabler/icons-react";
import styles from "./style.module.css";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BentoGridDemo() {
  return (
    <>
      <AnimatedHeadline>
        <h2 className={styles.headline}>학원출석과 미션을 통한 포인트 적립!</h2>
      </AnimatedHeadline>

      <BentoGrid className={styles.cards + " max-w-4xl mx-auto"}>
        {items.map((item, i) => (
          <AnimatedCard key={i}>
            {
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                header={item.header}
                icon={item.icon}
                className={i === 3 || i === 6 ? "md:col-span-2" : ""}
              />
            }
          </AnimatedCard>
        ))}
      </BentoGrid>
    </>
  );
}

function AnimatedCard({ children }: { children: React.ReactNode }) {
  const card = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (card.current) {
      gsap.from(card.current, {
        opacity: 0,
        x: -200,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card.current,
          start: "0px bottom",
          end: "bottom+=100px bottom",
          scrub: true,
        },
      });
    }
  }, []);

  return <div ref={card}>{children}</div>;
}

function AnimatedHeadline({ children }: { children: React.ReactNode }) {
  const card = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (card.current) {
      gsap.from(card.current, {
        opacity: -20,
        x: -3000,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card.current,
          start: "0px bottom",
          end: "bottom+=400px bottom",
          scrub: true,
        },
      });
    }
  }, []);

  return <div ref={card}>{children}</div>;
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
const items = [
  {
    title: "출석 포인트",
    description: (
      <>
        학원 출석만 해도 포인트 적립! <br />
        연속일자가 길어지면 추가 포인트를 받아요!
      </>
    ),
    header: <Skeleton />,
    icon: <IconMoodSmileBeam className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "개인 미션",
    description: (
      <>
        내가 직접 정한 미션을 실행할 수 있어요. <br />
        숙제, 설겆이 등 미션하고 포인트 쌓고!
      </>
    ),
    header: <Skeleton />,
    icon: <IconClockHour2 className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "팀 미션",
    description: (
      <>
        내가 정한 미션을 친구들과 하면 포인트가 2배! <br />
        정해진 시간에 친구들과 숙제 해 볼까요?
      </>
    ),
    header: <Skeleton />,
    icon: <IconUsersGroup className="h-4 w-4 text-neutral-500" />,
  },
];
