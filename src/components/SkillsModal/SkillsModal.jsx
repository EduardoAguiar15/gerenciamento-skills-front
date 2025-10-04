import { useState, useEffect } from "react";
import Adicionar from "../../assets/imgs/adicionaSkill.svg";
import styles from "./Styled.module.scss";
import { getSkills } from "../../service/api/index";
import { SkillsImg } from "../../components/SkillsImg/SkillsImg";
import PropTypes from 'prop-types';

function SkillsModal({ onSkillSelect, selectedSkills }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [skills, setSkills] = useState([]);
    const [error, setError] = useState(null);
    const [isListOpen, setIsListOpen] = useState(false);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                const data = await getSkills();
                setSkills(data);
            } catch {
                setError("Erro ao carregar as skills. Verifique sua autenticação.");
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    const availableSkills = skills.filter(
        (skill) => !selectedSkills.some((selected) => selected.skillId === skill.skillId)
    );

    const handleSkillClick = (skill) => {
        const skillWithImage = SkillsImg.find((img) => img.skill === skill.skillNome);
        const newSkill = {
            ...skill,
            skillImage: skillWithImage?.image,
            level: 1
        };

        onSkillSelect(newSkill);
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                            &times;
                        </button>
                        <h2 className={styles.modalTitle}>Adicionar Skill</h2>
                        <p className={styles.modalText}>Aqui você pode adicionar novas skills!</p>
                        <div className={styles.dropdown}>
                            <button
                                className={styles.dropdownButton}
                                onClick={() => setIsListOpen((prev) => !prev)}
                            >
                                {isListOpen ? "Esconder opções" : "Mostrar opções"}
                            </button>
                            {isListOpen && (
                                <ul className={styles.optionList}>
                                    {loading && <li>Carregando...</li>}
                                    {error && <li>{error}</li>}
                                    {!loading &&
                                        !error &&
                                        availableSkills.map((skill) => (
                                            <li key={skill.skillId} onClick={() => handleSkillClick(skill)}>
                                                {skill.skillNome}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.divImg}>
                <img
                    src={Adicionar}
                    alt="Adicionar Skill"
                    onClick={() => setIsModalOpen(true)}
                />
            </div>
        </>
    );
}

export default SkillsModal;

SkillsModal.propTypes = {
    onSkillSelect: PropTypes.func.isRequired,
    selectedSkills: PropTypes.arrayOf(
        PropTypes.shape({
            skillId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            skillNome: PropTypes.string.isRequired,
        })
    ).isRequired,
};
