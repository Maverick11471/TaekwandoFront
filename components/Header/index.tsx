"use client";

import { useCallback } from "react";
import Image from "next/image";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";

interface HeaderProps {
  className?: string; // className 속성 추가
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const router = useRouter();
  const onIntroduceClick = useCallback(() => {
    router.push("/introduce");
  }, []);

  const onMapClick = useCallback(() => {
    router.push("/map");
  }, [router]);

  const onLoginClick = useCallback(() => {
    // Please sync "Login" to the project
  }, []);

  const onMainClick = useCallback(() => {
    router.push("/");
  }, []);

  return (
    <div className={`${styles.header} ${className || ""}`}>
      <div className={styles.nav}>
        <button className={styles.mainsvg}>
          <Image
            className={styles.icon}
            width={13}
            height={15}
            alt=""
            src="/--1@2x.png"
          />
          <div className={styles.div} onClick={onMainClick}>
            경희대 최강 태권도
          </div>
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
