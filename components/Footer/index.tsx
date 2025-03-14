import styles from "./style.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.footerinner}>
        <div className={styles.left}>
          <b className={styles.b}>경희대 최강 태권도</b>
        </div>
        <div className={styles.right}>
          <div className={styles.div}>{`문의 : 0507-1447-0777 `}</div>
        </div>
      </div>
    </div>
  );
}
