import { useState, useRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Styled.module.scss';
import Button from '../../components/Button/Button';
import { postCadastro } from '../../service/api/index';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import RecaptchaInfo from '../../components/RecaptchaInfo/RecaptchaInfo';
import Loader from '../../components/Loader/Loader';
import { useModal } from '../../context/useModal';

const Register = () => {

    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    const [cadastroData, setCadastroData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false
    });
    const { showModal, closeAllModals } = useModal([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const recaptchaRef = useRef(null);

    const limparCampos = () => {
        setCadastroData({
            username: '',
            password: '',
            confirmPassword: '',
            showPassword: false,
            showConfirmPassword: false
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCadastroData((prev) => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setCadastroData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
    };

    const toggleConfirmPasswordVisibility = () => {
        setCadastroData((prev) => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (cadastroData.password !== cadastroData.confirmPassword) {
            showModal('As senhas não coincidem.', false, closeAllModals);
            setIsLoading(false);
            return;
        }

        if (cadastroData.password.length < 6) {
            showModal('Senha deve conter pelo menos 6 dígitos', false, closeAllModals);
            setIsLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cadastroData.username)) {
            showModal('Email inválido.', false, closeAllModals);
            setIsLoading(false);
            return;
        }

        if (!cadastroData.username || !cadastroData.password || !cadastroData.confirmPassword) {
            showModal('Todos os campos devem ser preenchidos.', false, closeAllModals);
            setIsLoading(false);
            return;
        }

        if (!recaptchaRef.current) {
            showModal('Erro no reCAPTCHA. Tente novamente.', false, closeAllModals);
            setIsLoading(false);
            return;
        }

        let recaptchaToken;

        try {
            recaptchaToken = await recaptchaRef.current.executeAsync();
        } catch {
            showModal('Erro ao validar o reCAPTCHA. Tente novamente.', false, closeAllModals);
            setIsLoading(false);
            return;
        }

        if (!recaptchaToken) {
            showModal('Falha ao obter o token do reCAPTCHA.', false, closeAllModals);
            setIsLoading(false);
            return;
        }

        try {
            const response = await postCadastro(
                cadastroData.username,
                cadastroData.password,
                cadastroData.confirmPassword,
                recaptchaToken
            );

            if (response.status === 200) {
                if (response.data?.success === false) {
                    const mensagemApi = response.data.message;
                    if (mensagemApi === "Email já cadastrado.") {
                        showModal('Email já cadastrado no sistema!', false, closeAllModals);
                        return;
                    }
                }
            }

            limparCampos();
            showModal('Usuário cadastrado com sucesso!', true, closeAllModals);
            navigate("/login");
        } catch {
            showModal('Erro ao cadastrar usuário.', false, closeAllModals);
        } finally {
            if (recaptchaRef.current) recaptchaRef.current.reset();
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.bodyCadastro}>
            {isLoading && <Loader />}
            <form className={`${styles.cadastroForm} ${isLoading ? styles.disabled : ""}`} onSubmit={handleSubmit}>
                <ReCAPTCHA
                    sitekey={siteKey}
                    size="invisible"
                    theme="dark"
                    ref={recaptchaRef}
                    onExpired={() => recaptchaRef.current?.reset()}
                />
                <h1>Cadastro</h1>

                <div className={styles.inputGroup}>
                    <label htmlFor="username">Email</label>
                    <input
                        type="email"
                        id="username"
                        name="username"
                        autoComplete="off"
                        value={cadastroData.username}
                        onChange={handleInputChange}
                        placeholder="Digite seu email"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">Senha</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            type={cadastroData.showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            value={cadastroData.password}
                            onChange={handleInputChange}
                            placeholder="Digite sua senha"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className={styles.showPasswordBtn}
                            aria-label={cadastroData.showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {cadastroData.showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword">Confirmar Senha</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            type={cadastroData.showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            autoComplete="new-password"
                            value={cadastroData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirme sua senha"
                            required
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className={styles.showPasswordBtn}
                            aria-label={cadastroData.showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {cadastroData.showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                <p>
                    <Link to="/login" className={styles.return}>Voltar para o login</Link>
                </p>
                <Button type="submit">Cadastrar</Button>
                <RecaptchaInfo />
            </form>
        </main>
    );
};

export default Register;