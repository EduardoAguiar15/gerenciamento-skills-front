import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { postSkillByUsuario, getSkillListByUsuario, getSkillByUsuario, putSkillByUsuario, deleteSkillByUsuario } from "../../service/api/index";
import styles from "./Styled.module.scss";
import Header from "../../components/Header/Header";
import { SkillsImg } from "../../components/SkillsImg/SkillsImg";
import SkillsModal from "../../components/SkillsModal/SkillsModal";
import EditUserModal from "../../components/Header/EditUserModal";
import { useModal } from '../../context/useModal';
import WelcomeModal from "../../components/WelcomeModal/WelcomeModal";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import SelectedSkill from "../../components/SelectedSkill/SelectedSkill";

function Skills() {
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [welcomeModal, setWelcomeModal] = useState(true)
    const [dynamicHeight, setDynamicHeight] = useState(calculateDynamicHeight(selectedSkills.length));
    const { showModal, closeAllModals } = useModal([]);

    function calculateDynamicHeight(skillsLength) {
        const screenWidth = window.innerWidth;

        if (screenWidth <= 647) {
            return Math.ceil(skillsLength / 1) * 530;
        } else if (screenWidth <= 995) {
            return Math.ceil(skillsLength / 2) * 550;
        } else if (screenWidth <= 1343) {
            return Math.ceil(skillsLength / 3) * 550;
        } else {
            return Math.ceil(skillsLength / 4) * 550;
        }
    }

    useEffect(() => {
        const handleResize = () => {
            setDynamicHeight(calculateDynamicHeight(selectedSkills.length));
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [selectedSkills]);

    useEffect(() => {
        if (selectedSkills.length > 0 && welcomeModal) {
            setWelcomeModal(false);
        }
    }, [selectedSkills, welcomeModal]);


    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                setUser(decodedToken.userId)
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchUserSkills = async () => {

            const startTime = Date.now();
            try {
                const userSkills = await getSkillListByUsuario(user);
                if (!userSkills || userSkills.length === 0) {
                    setSelectedSkills([]);
                    return;
                } else {
                    const skillsWithImages = userSkills.map((skill) => {
                        const skillWithImage = SkillsImg.find((img) => img.skill === skill.skillNome);
                        return {
                            ...skill,
                            skillImage: skillWithImage?.image,
                            skillAlt: skillWithImage?.altText,
                            vinculado: true
                        };
                    });
                    setSelectedSkills(skillsWithImages);
                }
            } catch (error) {
                console.error("Erro ao buscar skills do usuário:", error);
            } finally {
                const endTime = Date.now();
                const duration = endTime - startTime;
                const minDuration = 3500;

                const delay = Math.max(minDuration - duration, 0);

                setTimeout(() => {
                    setIsLoading(false);
                }, delay);
            }
        };

        fetchUserSkills();
    }, [user]);

    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isLoading]);

    const incrementLevel = (skillId) => {
        setSelectedSkills((prev) =>
            prev.map((skill) =>
                skill.skillId === skillId && skill.level < 10
                    ? { ...skill, level: skill.level + 1 }
                    : skill
            )
        );
    };

    const decrementLevel = (skillId) => {
        setSelectedSkills((prev) =>
            prev.map((skill) =>
                skill.skillId === skillId && skill.level > 1
                    ? { ...skill, level: skill.level - 1 }
                    : skill
            )
        );
    };

    const handleSaveSkill = async (skillId, level) => {
        try {

            if (!user) {
                showModal('ID do usuário não encontrado. Verifique se você está autenticado.', false, closeAllModals);
                return;
            }

            const configuracao = { skillId, level };
            const userSkill = await getSkillByUsuario(user, skillId);

            if (!userSkill) {
                await postSkillByUsuario(user, configuracao);
                showModal('Skill vinculada com sucesso!', true, closeAllModals);
                setSelectedSkills((prev) =>
                    prev.map((skill) =>
                        skill.skillId === skillId ? { ...skill, vinculado: true } : skill
                    )
                );
            } else {
                await putSkillByUsuario(user, configuracao);
                showModal('Vinculo atualizado com sucesso!', true, closeAllModals);

            }
        } catch {
            showModal('Erro ao salvar skill. Tente novamente!', false, closeAllModals);
        }
    };

    const removeVinculoSkill = async (skillId) => {
        try {
            const userSkill = await getSkillByUsuario(user, skillId);
            if (userSkill) {
                showModal('Vínculo deletado com sucesso!', true, closeAllModals);
            }
            await deleteSkillByUsuario(user, skillId).catch(() => {
            });
            setSelectedSkills((prev) => prev.filter((skill) => skill.skillId !== skillId));
        } catch {
            showModal('Erro ao deletar skill. Tente novamente!', false, closeAllModals);
        }
    };

    return (
        <main className={styles.main} style={{ minHeight: `${dynamicHeight}px` }}>
            <LoadingScreen isVisible={isLoading} />
            {!isLoading && (
                <>
                    <Header onEditClick={() => setShowEditModal(true)} />

                    {showEditModal && (
                        <EditUserModal onClose={() => setShowEditModal(false)} />
                    )}
                    <SkillsModal
                        onSkillSelect={(skill) => setSelectedSkills((prev) => [...prev, skill])}
                        selectedSkills={selectedSkills}
                    />
                    {selectedSkills.length > 0 && !welcomeModal && (
                        <div className={styles.skillsContainer}>
                            <div className={styles.selectedSkillsContainer}>
                                {selectedSkills.map((skill) => (
                                    <SelectedSkill
                                        key={skill.skillId}
                                        skill={skill}
                                        onIncrement={incrementLevel}
                                        onDecrement={decrementLevel}
                                        onSave={handleSaveSkill}
                                        onDelete={removeVinculoSkill}
                                    />
                                ))}

                            </div>
                        </div>
                    )}
                    {!isLoading && selectedSkills.length === 0 && (
                        <>
                            <div className={styles.body}>
                                <p className={`${styles.skills} ${styles.active}`}>Nenhuma Skill adicionada</p>
                                {welcomeModal == true && (
                                    < WelcomeModal welcomeClose={() => {
                                        setWelcomeModal(false)
                                    }} />
                                )}
                            </div>
                        </>
                    )}
                </>)}
        </main>
    );
}

export default Skills;