import styles from "./Styled.module.scss";
import { SkillsImg } from "../SkillsImg/SkillsImg";
import PropTypes from "prop-types";

const SelectedSkill = ({
    skill,
    onIncrement,
    onDecrement,
    onSave,
    onDelete,
}) => {
    const skillData = SkillsImg.find(img => img.skill === skill.skillNome);
    const skillImage = skillData?.image;
    const skillDescription = skillData?.descricao;
    const skillAlt = skillData?.altText

    return (
        <div className={styles.selectedSkill}>
            <div className={styles.divSkills}>
                <div className={styles.containerSkill}>
                    <h3>{skill.skillNome}</h3>
                    <img src={skillImage} alt={skillAlt} className={styles.skillImg} />
                    <p>{skillDescription}</p>
                    <div className={styles.buttons}>
                        <div className={styles.levelControl}>
                            <button onClick={() => onDecrement(skill.skillId)}>-</button>
                            <span>{skill.level}</span>
                            <button onClick={() => onIncrement(skill.skillId)}>+</button>
                        </div>
                        <div className={styles.buttonEdit}>
                            <button
                                onClick={() => onDelete(skill.skillId)}
                                disabled={!skill.vinculado}
                                className={`${styles.buttonExcluir} ${!skill.vinculado ? styles.disabled : ""}`}>
                                🗑️
                            </button>
                            <button
                                onClick={() => onSave(skill.skillId, skill.level)}
                                className={styles.buttonSalvar}>
                                ✔️
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

SelectedSkill.propTypes = {
    skill: PropTypes.shape({
        skillNome: PropTypes.string.isRequired,
        skillId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        level: PropTypes.number.isRequired,
        vinculado: PropTypes.bool,
    }).isRequired,
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default SelectedSkill;