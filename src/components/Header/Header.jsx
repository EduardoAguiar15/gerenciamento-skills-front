import styles from "./Styled.module.scss";
import { useAuth } from "../../context/useAuth";
import PropTypes from "prop-types";

function Header({ onEditClick }) {
    const { logout } = useAuth();

    return (
        <nav className={styles.nav}>
            <div className={styles.imgHeader}>
                <div className={styles.editButton}>
                    <img src="https://res.cloudinary.com/dptl0qlqr/image/upload/v1750308382/user_pwsmkq.png"
                        alt="Desenho de uma pessoa usando capuz mexendo no computador" onClick={onEditClick} className={styles.imgUser} />
                </div>
                <div className={styles.imgLogout}>
                    <img
                        src="https://res.cloudinary.com/dptl0qlqr/image/upload/v1750308329/logout_lrzf5n.png"
                        alt="Desenho de uma porta entreaberta com uma seta apontando para fora" onClick={logout} className={styles.logout}
                    />
                </div>
            </div>
        </nav>
    );
}

export default Header;

Header.propTypes = {
    onEditClick: PropTypes.func.isRequired,
};
