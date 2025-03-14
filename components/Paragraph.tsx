import { useScroll, useTransform, motion } from "framer-motion";
import React, { useRef } from "react";
import styles from "../styles/Paragraph.module.css";

interface ParagraphProps {
  paragraph: string;
}

// [1] Paragraph 컴포넌트 생성
// - props로 문자열(paragraph) 받음
// - container를 위한 useRef 생성
// - useScroll을 사용하여 스크롤 진행도 추적
// - paragraph를 공백 기준으로 나누어 단어 배열 생성
export default function Paragraph({ paragraph }: ParagraphProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.5", "start 0.1"],
  });

  const words = paragraph.split(" ");

  // [2] 문장 내 각 단어를 Word 컴포넌트로 감싸서 애니메이션 적용
  // - 단어별로 고유한 start, end 범위를 지정
  return (
    <p ref={container} className={styles.paragraph}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

interface WordProps {
  children: string;
  progress: any;
  range: [number, number];
}

// [3] Word 컴포넌트 생성
// - props로 단어(children), progress(스크롤 진행도), range(시작/끝 비율) 받음
// - 단어를 문자 단위로 쪼개서 Char 컴포넌트로 감싸줌
const Word = ({ children, progress, range }: WordProps) => {
  const amount = range[1] - range[0]; // 전체 범위 계산
  const step = amount / children.length; // 각 문자에 대한 간격 계산

  return (
    <span className={styles.word}>
      {children.split("").map((char, i) => {
        const start = range[0] + i * step;
        const end = range[0] + (i + 1) * step;
        return (
          <Char key={`c_${i}`} progress={progress} range={[start, end]}>
            {char}
          </Char>
        );
      })}
    </span>
  );
};

interface CharProps {
  children: string;
  progress: any;
  range: [number, number];
}

// [4] Char 컴포넌트 생성
// - props로 문자(children), progress, range 받음
// - useTransform을 이용해 opacity(투명도) 변환 적용
// - shadow 효과를 추가하여 부드러운 트랜지션 연출
const Char = ({ children, progress, range }: CharProps) => {
  const opacity = useTransform(progress, range, [0, 1]); // 스크롤 진행도에 따라 투명도 조절

  return (
    <span>
      <span className={styles.shadow}>{children}</span>
      <motion.span style={{ opacity: opacity }}>{children}</motion.span>
    </span>
  );
};
