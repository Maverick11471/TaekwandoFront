import type { NextPage } from "next";
import Image from "next/image";
import styles from "./introduce.module.css";
import "../app/globals.css";
import IntroduceIntro from "@/components/IntroduceIntro";
import IntroduceLayout from "@/components/IntroduceLayout";
import Header from "@/components/Header";
import MasterIntro from "@/components/MasterIntro";
import Footer from "@/components/Footer";

const Background: NextPage = () => {
  return (
    <>
      <Header />
      <IntroduceIntro />
      <IntroduceLayout />
      <MasterIntro />
      <Footer />
    </>
  );
};

export default Background;
