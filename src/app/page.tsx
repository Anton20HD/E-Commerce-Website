import styles from "./page.module.scss";
import StartPage from "./startPage/page";

export default function Home() {
  return (
    <>
      <main className={styles.main}>
          <StartPage/>
      </main>
    </>
  );
}


