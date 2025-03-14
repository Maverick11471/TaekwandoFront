"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
import Intro from "../components/Intro";
import Description from "../components/Description";
import Projects from "../components/Projects";
import Lenis from "lenis";
import LocomotiveScroll from "locomotive-scroll";

export default function Home() {
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const locomotiveScroll = new LocomotiveScroll();
    })();
  }, []);

  return (
    <main className={styles.main}>
      <Intro />
      <Description />
      <Projects />
    </main>
  );
}
