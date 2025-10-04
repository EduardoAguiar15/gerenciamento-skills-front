import { useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './Styled.module.scss';
import PropTypes from "prop-types";

const Modal = ({ message, isSuccess, onCloseCallback, sessionId, validateSession, clearSession }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const duration = 5000;
    const updateInterval = 50;

    const intervalId = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - (100 / (duration / updateInterval));
      });
    }, updateInterval);

    const timeoutId = setTimeout(() => {
      if (validateSession(sessionId)) {
        onCloseCallback();
        clearSession();
      }
    }, duration);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [onCloseCallback, sessionId, validateSession, clearSession]);

  const handleClose = () => {
    onCloseCallback();
    clearSession();
  };

  return (
    <div className={styles.modalBackdrop} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleClose}>×</button>
        <div className={styles.iconWrapper}>
          {isSuccess ? <CheckCircleIcon color="success" fontSize="large" /> : <CancelIcon color="error" fontSize="large" />}
        </div>
        <p className={styles.messageModal}>{message}</p>
        <div
          className={`${styles.progressBar} ${isSuccess ? styles.success : styles.error}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  message: PropTypes.string.isRequired,
  isSuccess: PropTypes.bool.isRequired,
  onCloseCallback: PropTypes.func.isRequired,
  sessionId: PropTypes.string,
  validateSession: PropTypes.func,
  clearSession: PropTypes.func
}
