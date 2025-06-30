import { useEffect, useRef, useState } from "react";
import styles from "./Styled.module.scss";

const Loader = () => {
  const [dots, setDots] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    const dotSequence = ["", ".", "..", "...", "..", ".", ""];
    const interval = setInterval(() => {
      setDots(dotSequence[indexRef.current]);
      indexRef.current = (indexRef.current + 1) % dotSequence.length;
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.loader}>
      <p>Carregando<span className={styles.dots}>{dots}</span></p>
    </div>
  );
};

export default Loader;