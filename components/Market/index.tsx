"use client";
import React from "react";
import { ColourfulText } from "./colorful-text";
import { motion } from "motion/react";

export default function ColourfulTextDemo() {
  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      <motion.img
        src="/j_g10Ud018svc1vvza5xm9hrba_qpsuhl.jpg"
        className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_30%)] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
        style={{ objectFit: "cover", objectPosition: "top" }}
      />

      <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
        적립한 포인트, <ColourfulText text="포인트시장에서" /> <br /> 원하는
        보상으로!
      </h1>
    </div>
  );
}
