"use client";

import type { NextPage } from "next";
import { useCallback } from "react";
import Image from "next/image";
import styles from "../styles/Header.module.css";

interface HeaderProps {
  className?: string; // className 속성 추가
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const onIntroduceClick = useCallback(() => {
    // Please sync "Introduce" to the project
  }, []);

  const onMapClick = useCallback(() => {
    // Please sync "Map" to the project
  }, []);

  const onLoginClick = useCallback(() => {
    // Please sync "Login" to the project
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.nav}>
        <button className={styles.mainsvg}>
          <Image
            className={styles.icon}
            width={13}
            height={15}
            alt=""
            src="/--1@2x.png"
          />
          <div className={styles.div}>경희대 최강 태권도</div>
        </button>
        <div className={styles.navigatecon}>
          <div className={styles.navigate}>
            <button className={styles.introduce} onClick={onIntroduceClick}>
              <div className={styles.div1}>{`학원 소개 `}</div>
            </button>
            <button className={styles.map} onClick={onMapClick}>
              <div className={styles.div1}>오시는길</div>
            </button>
          </div>
          <div className={styles.loginbutton}>
            <button className={styles.login} onClick={onLoginClick}>
              로그인
            </button>
          </div>
          <div>
            <Image
              className={styles.hamburgerbuttonIcon}
              width={33}
              height={24}
              alt=""
              src="/hamburgerbutton.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
