import type { NextPage } from "next";
import Image from "next/image";
import styles from "./map.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../app/globals.css";

const Map1: NextPage = () => {
  return (
    <>
      <Header />
      <div className={styles.fullContainer}>
        <div className={styles.mapTitle}>오시는 길</div>
        <div className={styles.mainTitle}>경희대 최강 태권도</div>
        <div className={styles.addressContainer}>
          <div className={styles.address}>주소</div>
          <div className={styles.description}>
            경기 의정부시 경의로 115 2층 201동
          </div>
        </div>
        <div className={styles.numberContainer}>
          <div className={styles.address}>전화번호</div>
          <div className={styles.description}>0507-1447-0777</div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Map1;
