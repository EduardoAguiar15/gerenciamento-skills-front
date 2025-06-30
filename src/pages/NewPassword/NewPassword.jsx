import { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import styles from "./Styled.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { postRedefineSenha } from "../../service/api/index";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import { useModal } from '../../context/useModal';

const NewPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { showModal, closeAllModals } = useModal([]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const extractedToken = searchParams.get("token");

        const tokenRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
        if (!extractedToken || !tokenRegex.test(extractedToken)) {
            showModal('Token inválido ou ausente.', false);
            navigate("/login");
        }
    }, [location, navigate, showModal]);

    const [isLoading, setIsLoading] = useState(false);
    const [newPasswordData, setNewPasswordData] = useState({
        novaSenha: "",
        confirmaSenha: "",
        showSenha: false,
        showConfirmaSenha: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setNewPasswordData((prev) => ({ ...prev, showSenha: !prev.showSenha }));
    };

    const toggleConfirmPasswordVisibility = () => {
        setNewPasswordData((prev) => ({ ...prev, showConfirmaSenha: !prev.showConfirmaSenha }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (newPasswordData.novaSenha !== newPasswordData.confirmaSenha) {
            showModal('As senhas não coincidem!', false, closeAllModals);
            setIsLoading(false);
            return;
        }

        if (newPasswordData.novaSenha.length < 6) {
            showModal('Senha deve conter pelo menos 6 dígitos', false, closeAllModals);
            setIsLoading(false);
            return;
        }

        try {
            const searchParams = new URLSearchParams(location.search);
            const token = searchParams.get("token");

            if (!token) {
                showModal('Erro ao redefinir senha!', false, closeAllModals);
                setIsLoading(false);
                return;
            }

            const response = await postRedefineSenha(token, newPasswordData.novaSenha, newPasswordData.confirmaSenha);

            if (response.status === 200 && response.data?.success === false) {
                const mensagemApi = response.data.message;
                if (mensagemApi === "Token inválido ou expirado.") {
                    showModal('Token inválido ou expirado.', false, closeAllModals);
                    setIsLoading(false);
                    return;
                }
            }
            showModal('Senha redefinida com sucesso!', true, closeAllModals);
            navigate("/login");
        } catch (error) {
            if (error.response && error.response.status === 400) {
                showModal('Erro ao redefinir a senha.', false, closeAllModals);
            } else {
                showModal('Erro inesperado ao redefinir a senha.', false, closeAllModals);
            }
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.newPasswordBody}>
            {isLoading && <Loader />}
            <form className={`${styles.newPasswordForm} ${isLoading ? styles.disabled : ""}`} onSubmit={handleSubmit}>
                <h1>Redefinir senha</h1>
                <p className={styles.passwordText}>Informe sua nova senha abaixo</p>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">Nova Senha</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            type={newPasswordData.showSenha ? 'text' : 'password'}
                            id="password"
                            name="novaSenha"
                            value={newPasswordData.novaSenha}
                            onChange={handleInputChange}
                            placeholder="Digite sua nova senha"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className={styles.showPasswordBtn}
                            aria-label={newPasswordData.showSenha ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {newPasswordData.showSenha ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword">Confirmar senha</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            type={newPasswordData.showConfirmaSenha ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmaSenha"
                            value={newPasswordData.confirmaSenha}
                            onChange={handleInputChange}
                            placeholder="Confirme sua nova senha"
                            required
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className={styles.showPasswordBtn}
                        >
                            {newPasswordData.showConfirmaSenha ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                <p>
                    <Link to="/login" className={styles.return}>Voltar para o login</Link>
                </p>
                <Button type="submit">Enviar</Button>

            </form>
        </main>
    )
};

export default NewPassword;