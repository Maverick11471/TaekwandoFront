import styles from "./style.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.left}>경희대 최강 태권도</div>
      <div className={styles.right}>문의 : 0507-1447-0777</div>
    </div>
  );
}
