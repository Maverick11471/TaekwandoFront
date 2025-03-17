import type { NextPage } from "next";
import Image from "next/image";
import styles from "./style.module.css";
import "../../app/globals.css";

const IntroduceIntro: NextPage = () => {
  return (
    <div className={styles.background}>
      <div className={styles.image}></div>
      <div className={styles.parent}>
        <b className={styles.b}>
          <div className={styles.p}>"체력 뿐만 아니라</div>
          <div className={styles.p}>마음까지 성장하는 아이로"</div>
        </b>
        <Image
          className={styles.downArrowpngIcon}
          width={28}
          height={14}
          alt=""
          src="/downarrowpng@2x.png"
        />
      </div>
    </div>
  );
};

export default IntroduceIntro;
