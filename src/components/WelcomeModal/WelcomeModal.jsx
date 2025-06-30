import Button from "../Button/Button";
import styles from "./Styled.module.scss"
import PropTypes from "prop-types";

function WelcomeModal({ welcomeClose }) {

    return (
        <div className={styles.modalBody}>
            <div className={styles.modalWelcome}>
                <h2>Bem vindo ao Sistema de Gerenciamento de Skills</h2>
                <img src="https://res.cloudinary.com/dptl0qlqr/image/upload/v1750308435/setting_yns88r.png" alt="imagem de uma engrenagem girando no sentido horário" className={styles.engrenagem} />
                <img src="https://res.cloudinary.com/dptl0qlqr/image/upload/v1750308435/setting_yns88r.png" alt="imagem de uma engrenagem girando no sentido antihorário" className={styles.engrenagem2} />
                <h3>Aqui você pode criar, atualizar e remover vínculos entre você e as habilidades!</h3>
                <Button className={styles.closeButton} onClick={welcomeClose}>Ok
                </Button>
            </div>
        </div>
    )
}

export default WelcomeModal;

WelcomeModal.propTypes = {
    welcomeClose: PropTypes.func.isRequired,
}