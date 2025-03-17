"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "./apple-cards-carousel";
import styles from "./style.module.css";

export default function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-30">
      <h2
        className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans"
        style={{ lineHeight: 4.0 }}
      >
        눈높이를 맞추는 태권도
      </h2>
      <div
        className="max-w-7xl pl-4 mx-auto text-xl md:text-3xl  text-neutral-400 dark:text-neutral-100 font-sans"
        style={{ lineHeight: 2.0 }}
      >
        눈맞춤 교육으로 공감하고, <br />
        태권도로 자신감과 집중력을 키워갑니다.
      </div>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <Image
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "태권도",
    title: (
      <>
        품새로 집중력을, <br />
        겨루기로 <br />
        도전 정신을!
      </>
    ),
    src: "/경희대최강태권도 & 음악줄넘기-전체 사진-39756895300.jpg",
    content: <DummyContent />,
  },
  {
    category: "유아체육",
    title: (
      <>
        아이의 성장과 <br />
        건강한 미래를
        <br /> 만들어갑니다.
      </>
    ),
    src: "/c-910ud018svc4khl5a075moo-qpsuhl-1@2x.png",
    content: <DummyContent />,
  },
  {
    category: "음악줄넘기",
    title: (
      <>
        리듬에 맞춰 뛰며,
        <br /> 균형잡힌 운동으로
        <br /> 키가 쑥쑥!
      </>
    ),
    src: "/---39756895317@2x.png",
    content: <DummyContent />,
  },

  {
    category: "체험형 활동 프로그램",
    title: (
      <>
        놀이와 학습을 <br />
        모두 즐기는 <br />
        종합 체험 프로그램!
      </>
    ),
    src: "/---41796892011@2x.png",
    content: <DummyContent />,
  },
  {
    category: "전문강사진",
    title: (
      <>
        여자사범과 <br />
        기사님이 함께,
        <br /> 안전한 돌봄을 <br />
        보장합니다.
      </>
    ),
    src: "/---40388424189-1@2x.png",
    content: <DummyContent />,
  },
  {
    category: "안심서비스",
    title: (
      <>
        SNS로 활동사진,
        <br /> 공지사항 전파 등 <br />
        부모님께 안심을
        <br /> 드립니다.
      </>
    ),
    src: "/Container.png",
    content: <DummyContent />,
  },
];
