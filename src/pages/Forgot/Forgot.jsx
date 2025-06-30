import { useState, useEffect, useRef } from "react";
import Button from "../../components/Button/Button";
import styles from "./Styled.module.scss";
import { postSolicitaRedefinir } from "../../service/api/index";
import { Link } from "react-router-dom";
import RecaptchaInfo from "../../components/RecaptchaInfo/RecaptchaInfo";
import ReCAPTCHA from "react-google-recaptcha";
import Loader from '../../components/Loader/Loader';
import { useModal } from '../../context/useModal';

const Forgot = () => {

    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    const { showModal, closeAllModals } = useModal([]);
    const recaptchaRef = useRef(null);
    const [timer, setTimer] = useState(600);
    const [showTimer, setShowTimer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [forgotData, setForgotData] = useState({
        email: "",
    });

    const targetTimeRef = useRef(null);

    useEffect(() => {
        if (!showTimer) return;

        const interval = setInterval(() => {
            const agora = Date.now();

            if (targetTimeRef.current) {
                const segundosRestantes = Math.floor((targetTimeRef.current - agora) / 1000);

                if (segundosRestantes <= 0) {
                    setShowTimer(false);
                    clearInterval(interval);
                }

                setTimer(segundosRestantes);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [showTimer]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForgotData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(forgotData.email)) {
            showModal('Email inválido.', false, closeAllModals);
            setIsLoading(false);
            return;
        }

        if (!recaptchaRef.current) {
            showModal('Erro ao carregar o reCAPTCHA.', false, closeAllModals);
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

        // const inicioRequisicao = Date.now();
        try {
            const response = await postSolicitaRedefinir(forgotData.email, recaptchaToken);

            if (response.data?.expiraEm && response.data?.servidorAgora) {
                const expiraEm = new Date(response.data.expiraEm);
                const servidorAgora = new Date(response.data.servidorAgora);
                let segundosRestantes = Math.floor((expiraEm - servidorAgora) / 1000);

                segundosRestantes = Math.max(0, segundosRestantes);

                if (segundosRestantes > 0) {
                    targetTimeRef.current = Date.now() + segundosRestantes * 1000;
                    setTimer(segundosRestantes);
                    setShowTimer(true);
                }
            }
            showModal('Email enviado com sucesso!', true, closeAllModals);
        } catch (error) {
            console.error("erro da api:", error);
            showModal('Erro ao enviar email!', false, closeAllModals);
        } finally {
            recaptchaRef.current?.reset();
            setIsLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const min = String(Math.floor(seconds / 60)).padStart(2, "0");
        const sec = String(seconds % 60).padStart(2, "0");
        return `${min}:${sec}`;
    };

    return (
        <main className={styles.forgotBody}>
            {isLoading && <Loader />}
            <form className={`${styles.forgotForm} ${isLoading ? styles.disabled : ""}`} onSubmit={handleSubmit}>
                <ReCAPTCHA
                    sitekey={siteKey}
                    size="invisible"
                    theme="dark"
                    ref={recaptchaRef}
                    onExpired={() => recaptchaRef.current?.reset()}
                />
                <h1>Esqueceu sua senha?</h1>
                <p className={styles.forgotText} >Informe seu e-mail cadastrado abaixo para enviarmos um link de redefinição de senha</p>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="current-username"
                        value={forgotData.email}
                        onChange={handleInputChange}
                        placeholder="Digite seu email"
                        required
                    />
                </div>
                {showTimer && timer > 0 && (
                    <p className={styles.timer}>
                        O Link expira em: {formatTime(timer)}
                    </p>
                )}
                <div className={styles.forgotButtons}>
                    <Button type="submit">Enviar</Button>
                    <Link to="/login" className={styles.forgotReturn}>Voltar para login</Link>

                </div>
                <RecaptchaInfo />
            </form>
        </main>
    )
};

export default Forgot;