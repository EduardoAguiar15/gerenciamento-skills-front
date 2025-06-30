import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Styled.module.scss";
import Button from "../../components/Button/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import RecaptchaInfo from "../../components/RecaptchaInfo/RecaptchaInfo";
import Loader from '../../components/Loader/Loader';
import { useModal } from '../../context/useModal';

const LoginForm = () => {

  const { showModal, closeAllModals } = useModal([]);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const location = useLocation();

  const { login, rememberMe, setRememberMe } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(!!location.state?.message);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    showPassword: false,
  });

  const recaptchaRef = useRef();

  useEffect(() => {
    if (showSuccessModal) {
      setTimeout(() => setShowSuccessModal(false), 5000);
    }
  }, [showSuccessModal]);

  useEffect(() => {
    const savedRememberMe = JSON.parse(localStorage.getItem("rememberMe")) || false;
    const savedEmail = localStorage.getItem("username") || "";
    const savedPassword = localStorage.getItem("password") || "";
    setRememberMe(savedRememberMe);

    if (savedRememberMe) {
      setLoginData((prev) => ({ ...prev, username: savedEmail, password: savedPassword }));
    }
  }, [setRememberMe]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setLoginData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);

    if (isChecked) {
      localStorage.setItem("rememberMe", JSON.stringify(isChecked));
      localStorage.setItem("username", loginData.username);
      localStorage.setItem("password", loginData.password);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!recaptchaRef.current) return;

    let recaptchaToken;

    try {
      recaptchaToken = await recaptchaRef.current.executeAsync();

    } catch {
      showModal("Erro ao validar o reCAPTCHA. Tente novamente.", false, closeAllModals)
      setIsLoading(false);
      return;
    }
    if (!recaptchaToken) {
      showModal("Falha ao obter o token do reCAPTCHA.", false, closeAllModals)
      setIsLoading(false);
      return;
    }
    try {
      await login(loginData.username, loginData.password, rememberMe, recaptchaToken);

    } catch {
      showModal("Erro ao autenticar. Tente novamente.", false, closeAllModals)
    }
    finally {
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setIsLoading(false);
    }

  };

  return (
    <main className={styles.bodyLogin}>
      {isLoading && <Loader />}
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <ReCAPTCHA
          sitekey={siteKey}
          size="invisible"
          theme="dark"
          ref={recaptchaRef}
          onExpired={() => {
            recaptchaRef.current?.reset();
          }}
        />
        <h1>Entrar</h1>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Email</label>
          <input
            type="email"
            id="username"
            name="username"
            autoComplete="current-username"
            value={loginData.username}
            onChange={handleInputChange}
            placeholder="Digite seu email"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Senha</label>
          <div className={styles.passwordWrapper}>
            <input
              type={loginData.showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="new-password"
              value={loginData.password}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              required
            />
            <button type="button" onClick={togglePasswordVisibility}
              className={styles.showPasswordBtn}
              aria-label={loginData.showPassword ? "Ocultar senha" : "Mostrar senha"}>
              {loginData.showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.containerGroup}>
            <label className={styles.rememberMe} htmlFor="rememberMe">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => {
                  handleCheckboxChange(e)
                }}
              />
              Mantenha-me conectado
            </label>
            <Link to="/esqueci-senha" className={styles.forgotLink}>Esqueceu sua senha?</Link>
          </div>
        </div>
        <Button type="submit">Entrar</Button>
        <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
        <RecaptchaInfo />
      </form>
    </main>
  );
};

export default LoginForm;