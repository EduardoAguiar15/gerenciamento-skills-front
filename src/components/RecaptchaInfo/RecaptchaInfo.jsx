import styles from "./Styled.module.scss";
import { useState } from "react";

function RecaptchaInfo() {

  const [showMore, setShowMore] = useState(false);

  return (
    <div>
      <p className={styles.recaptchaInfo}>
        Esta página é protegida pelo Google reCAPTCHA para garantir que você não é um robô.
        <br />

        {!showMore && (<a className={styles.policyRecaptcha} onClick={() => setShowMore(true)}>Saiba mais</a>)}
      </p>
      {showMore && (
        <p className={styles.recaptchaInfo}>
          As informações recolhidas estão sujeitas à&nbsp;
          <a href="https://policies.google.com/privacy" className={styles.policyRecaptcha} target="_blank" rel="noopener noreferrer">
            Política de Privacidade
          </a>{" "}
          e aos&nbsp;
          <a href="https://policies.google.com/terms" className={styles.policyRecaptcha} target="_blank" rel="noopener noreferrer">
            Termos de Uso
          </a>{" "}
          do Google e são usadas para oferecer, manter e melhorar o serviço reCAPTCHA.
        </p>
      )}
    </div>
  );
}

export default RecaptchaInfo;