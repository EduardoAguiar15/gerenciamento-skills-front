import { useState } from "react";
import styles from "./Styled.module.scss";
import { putUsuario } from "../../service/api";
import { useAuth } from "../../context/useAuth";
import { useModal } from '../../context/useModal';
import { useNavigate } from 'react-router-dom';
import { deleteUsuario } from "../../service/api";
import PropTypes from "prop-types";

function ConfirmModal({ onCancel, onClose, email, senhaAtual, novaSenha, isPasswordFieldVisible, buttonSelected, modalSessionId }) {

    const { user, updateToken, logout } = useAuth();
    const { showModal } = useModal([]);
    const [modalType, setModalType] = useState(false);
    const navigate = useNavigate();

    const userId = user?.userId;

    const showResultModal = (mensagem, isSuccess) => {
        const idLocal = modalSessionId;

        const safeClose = () => {
            if (modalSessionId === idLocal) {
                onClose();
            }
        };

        setModalType(true);
        showModal(mensagem, isSuccess, safeClose, modalSessionId,
            (id) => id === modalSessionId,
            () => { });
    };

    const handleDelete = async () => {
        try {
            const response = await deleteUsuario(userId);

            if (response.status === 204) {
                logout();
                showResultModal('Usuário deletado com sucesso!', true);
                navigate("/login");
            }
        } catch {
            showResultModal('Erro ao deletar usuário. Tente novamente!', false);

        }
    }

    const handleConfirm = async () => {
        try {
            const configuracao = {
                email,
            };

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(configuracao.email)) {
                showResultModal('Email inválido.', false);
                return;
            }

            if (isPasswordFieldVisible) {
                if (!senhaAtual || !novaSenha) {
                    showResultModal('Preencha a senha atual e a nova senha.', false);
                    return;
                } else if (senhaAtual === novaSenha) {
                    showResultModal("Nova senha deve ser diferente da atual.", false);
                    return;
                } else if (novaSenha.length < 6) {
                    showResultModal("Nova senha deve conter pelo menos 6 dígitos", false);
                    return;
                }

                configuracao.senhaAtual = senhaAtual;
                configuracao.novaSenha = novaSenha;
            }

            const response = await putUsuario(userId, configuracao);

            if (response.status === 200) {
                if (response.data?.success === false) {
                    const mensagemApi = response.data.message;

                    if (mensagemApi === "Email já cadastrado.") {
                        showResultModal('Email já cadastrado no sistema.', false);
                    } else if (mensagemApi === "O Novo email deve ser diferente.") {
                        showResultModal('O Novo email deve ser diferente do atual.', false);
                    } else if (mensagemApi === "Senha atual incorreta.") {
                        showResultModal('Senha atual incorreta.', false);
                    } else {
                        showResultModal(mensagemApi || 'Erro ao atualizar usuário. Tente novamente!', false);
                    }
                    return;
                }

                const novoToken = response.headers["authorization"] || response.headers["Authorization"];

                if (novoToken) {
                    const tokenFormatado = novoToken.replace("Bearer ", "");
                    updateToken(tokenFormatado);
                    showResultModal('Usuário atualizado com sucesso!', true);
                } else {
                    showResultModal('Erro ao atualizar usuário. Tente novamente!', false);
                }
            } else {
                showResultModal('Erro ao atualizar usuário. Tente novamente!', false);
            }

        } catch {
            showResultModal('Erro ao atualizar usuário. Tente novamente!', false);
        }
    };

    return (
        <div className={styles.modalBackground}>
            <div className={`${styles.modal2} ${modalType ? styles.disabled : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeBtn1} onClick={onCancel}>x</button>
                <h2>Tem certeza que deseja {buttonSelected === "delete" ? "deletar sua conta?" : "salvar as alterações?"}</h2>
                <div className={styles.buttons}>
                    <button className={styles.buttonConfirm} onClick={() => {
                        if (buttonSelected === "delete") {
                            handleDelete();
                        } else {
                            handleConfirm();
                        }
                    }}>Confirmar</button>

                    <button className={styles.buttonCancel} onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

ConfirmModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    senhaAtual: PropTypes.string,
    novaSenha: PropTypes.string,
    isPasswordFieldVisible: PropTypes.bool.isRequired,
    buttonSelected: PropTypes.oneOf(['save', 'delete']).isRequired,
    modalSessionId: PropTypes.string.isRequired,
};