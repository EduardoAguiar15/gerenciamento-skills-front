import PropTypes from 'prop-types';
import styles from './Styled.module.scss';

const Button = ({ children, type = 'button', onClick = () => {} }) => {
  return (
    <button type={type} className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
