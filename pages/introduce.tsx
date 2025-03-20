import type { NextPage } from "next";

import IntroduceIntro from "@/components/IntroduceIntro";
import IntroduceLayout from "@/components/IntroduceLayout";

import MasterIntro from "@/components/MasterIntro";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

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
