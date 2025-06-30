import { createContext, useState, useRef } from 'react';
import Modal from '../components/Modal/Modal';
import PropTypes from 'prop-types';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);
  const timeoutsRef = useRef({});
  const calledRef = useRef({});

  const showModal = (
    message,
    isSuccess,
    onCloseCallback = null,
    sessionId = null,
    validateSession = () => true,
    clearSession = () => { }
  ) => {
    const id = crypto.randomUUID();
    
    const safeOnClose = () => {
      if (!calledRef.current[id]) {
        if (onCloseCallback) onCloseCallback();
        calledRef.current[id] = true;
      }
    };
    
    const modalData = {
      id,
      message,
      isSuccess,
      onCloseCallback: safeOnClose,
      sessionId,
      validateSession,
      clearSession,
    };
    setModals(prev => [...prev, modalData]);

    calledRef.current[id] = false;

    const timeoutId = setTimeout(() => {
      handleClose(id);
    }, 5000);

    timeoutsRef.current[id] = timeoutId;
  };

  const closeAllModals = () => {
    setModals([]);
    Object.values(timeoutsRef.current).forEach(clearTimeout);
    timeoutsRef.current = {};
    calledRef.current = {};
  };
  
  const handleClose = (id) => {

    const modalToClose = modals.find(m => m.id === id);
    if (!modalToClose) return;

    setModals(prev => prev.filter(m => m.id !== id));

    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }

    modalToClose.onCloseCallback?.();
    delete calledRef.current[id];
  };

  const contextValue = {
    showModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, marginBottom: "10px", zIndex: 9999 }}>
        {modals.map(modal => (
          <Modal
            key={modal.id}
            message={modal.message}
            isSuccess={modal.isSuccess}
            sessionId={modal.sessionId}
            validateSession={modal.validateSession}
            clearSession={modal.clearSession}
            onCloseCallback={() => handleClose(modal.id)}
          />
        ))}
      </div>
    </ModalContext.Provider>
  );
};

export { ModalContext };

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired
};