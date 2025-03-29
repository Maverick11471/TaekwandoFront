import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import styles from "./style.module.css";

const phrases = [
  "아이들은 태권도를 할 때 놀라운 집중력을 발휘합니다.",
  "그 집중력이 집에서도 이어진다면 얼마나 좋을까요?",
  "재미있고 성취감 있게 공부할 수 있도록,",
  "운동처럼 자연스럽게 몰입할 수 있도록,",
  "그 길을 함께 찾아가고자 이 과정을 시작했습니다.",
];

export default function Index() {
  return (
    <div className={styles.description}>
      {phrases.map((phrase, index) => {
        return <AnimatedText key={index}>{phrase}</AnimatedText>;
      })}
    </div>
  );
}

function AnimatedText({ children }: { children: React.ReactNode }) {
  const text = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(text.current, {
      scrollTrigger: {
        trigger: text.current,
        scrub: true,
        start: "0px bottom",
        end: "bottom+=400px bottom",
      },
      opacity: 0,
      left: "-200px",
      ease: "power3.out",
    });
  }, []);

  return <p ref={text}>{children}</p>;
}
