import styles from "./Styled.module.scss";

const NotFound = () => {

    return (
        <main className={styles.notFound}>
            <div className={styles.notFoundContainer}>
                <div className={styles.imgDivNotFound}>
                    <img src="https://res.cloudinary.com/dptl0qlqr/image/upload/v1750308680/exclamation_wuxvkf.png" alt="imagem de exclamação"/>
                </div>
                <h1>
                    404
                </h1>
                <h2>
                    URL não encontrada
                </h2>
                <h3>
                    <a href="/">Clique aqui para voltar ao sistema</a>
                </h3>
            </div>
        </main>
    )
}

export default NotFound