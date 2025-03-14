"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
import Intro from "../components/Intro";
import Description from "../components/Description";
import Projects from "../components/Projects";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Market from "@/components/Market";

export default function Home() {
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      new LocomotiveScroll();
    })();
  }, []);

  return (
    <main className={styles.main}>
      <Header />
      <Intro />
      <Description />
      <Projects />
      <Market />
      <Footer />
    </main>
  );
}
