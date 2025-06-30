import { useState, useEffect, useRef } from "react";
import styles from "./Styled.module.scss";
import PropTypes from "prop-types";

const LoadingScreen = ({ isVisible }) => {
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
        <div className={`${styles.overlay} ${!isVisible ? styles.hidden : ""}`}>
            <h1>Carregando<span className={styles.dots}>{dots}</span></h1>
            <img src="https://res.cloudinary.com/dptl0qlqr/image/upload/v1750308435/setting_yns88r.png" alt="imagem de uma engrenagem girando no sentido horário" className={styles.engrenagem} />
            <img src="https://res.cloudinary.com/dptl0qlqr/image/upload/v1750308435/setting_yns88r.png" alt="imagem de uma engrenagem girando no sentido antihorário" className={styles.engrenagem2} />
        </div>
    );
};

export default LoadingScreen;

LoadingScreen.propTypes = {
    isVisible: PropTypes.bool.isRequired,
}