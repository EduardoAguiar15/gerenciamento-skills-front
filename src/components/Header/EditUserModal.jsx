import styles from "./Styled.module.scss";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import jwt_decode from "jwt-decode";
import ConfirmModal from "./ConfirmModal";
import PropTypes from "prop-types";
import { useAuth } from "../../context/useAuth";

function EditUserModal({ onClose }) {
    const [email, setEmail] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [isPasswordFieldVisible, setPasswordFieldVisible] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [deleteButton, setDeleteButton] = useState(false);
    const [modalSessionId, setModalSessionId] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const token = user?.token;

        if (token) {
            try {
                const decodedToken = jwt_decode(token);

                if (decodedToken.sub) {
                    setEmail(decodedToken.sub);
                }
            } catch {
                return;
            }
        }
    }, [user?.token]);

    return (
        <>
            <div className={styles.backdrop}>
                <div className={styles.modal1}>
                    <button className={styles.closeBtn} onClick={onClose}>x</button>
                    <h2 className={styles.editUser}>Editar Dados</h2>
                    <form className={styles.editUserModal}>
                        <label className={styles.editLabel}>Email:</label>
                        <input
                            type="email"
                            name="username_email"
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.editEmail}
                        />
                        {isPasswordFieldVisible && (
                            <>
                                <label className={styles.editLabel}>Senha Atual:</label>
                                <div className={styles.passwordContainer}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="senhaAtual"
                                        value={senhaAtual}
                                        autoComplete="new-password"
                                        onChange={(e) => setSenhaAtual(e.target.value)}
                                        className={styles.editSenha}
                                    />
                                    <span
                                        type="button"
                                        className={styles.eyeButton1}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                                    </span>
                                </div>

                                <label className={styles.editLabel}>Nova Senha:</label>
                                <div className={styles.passwordContainer}>
                                    <input
                                        type={showPassword2 ? "text" : "password"}
                                        name="novaSenha"
                                        value={novaSenha}
                                        autoComplete="new-password"
                                        onChange={(e) => setNovaSenha(e.target.value)}
                                        className={styles.editSenha}
                                    />
                                    <span
                                        type="button"
                                        className={styles.eyeButton}
                                        onClick={() => setShowPassword2(!showPassword2)}
                                    >
                                        {showPassword2 ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                                    </span>
                                </div>
                            </>
                        )}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setPasswordFieldVisible(!isPasswordFieldVisible);
                            }}
                            className={styles.linkAlterarSenha}
                        >
                            Alterar senha
                        </a>
                        <div className={styles.buttons}>
                            <button type="button" className={styles.buttonSalvar} onClick={() => {
                                const id = crypto.randomUUID();
                                setModalSessionId(id);
                                setConfirmModal(true);
                            }}>Salvar</button>
                            <button type="button" className={styles.buttonDeletar} onClick={() => {
                                const id = crypto.randomUUID();
                                setModalSessionId(id);
                                setDeleteButton(true);
                            }}>Deletar conta</button>
                        </div>
                    </form>
                </div>
            </div>
            {(confirmModal || deleteButton) && (
                <ConfirmModal
                    onClose={() => {
                        setConfirmModal(false);
                        setDeleteButton(false);
                        setModalSessionId(null);
                    }}
                    onCancel={() => {
                        setConfirmModal(false);
                        setDeleteButton(false);
                        setModalSessionId(null);
                    }}
                    email={email}
                    senhaAtual={senhaAtual}
                    novaSenha={novaSenha}
                    isPasswordFieldVisible={isPasswordFieldVisible}
                    buttonSelected={deleteButton ? "delete" : "save"}
                    modalSessionId={modalSessionId}
                />
            )}

        </>
    )
}

export default EditUserModal;

EditUserModal.propTypes = {
    onClose: PropTypes.func.isRequired,
}