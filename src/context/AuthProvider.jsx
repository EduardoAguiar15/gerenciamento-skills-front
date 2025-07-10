import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { postLogin } from "../service/api";
import { useNavigate } from "react-router-dom";
import { useModal } from './useModal';
import jwtDecode from "jwt-decode";
import PropTypes from "prop-types";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const { showModal, closeAllModals} = useModal([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token")

    setRememberMe(JSON.parse(localStorage.getItem("rememberMe")) || false);

    if (token) {
      const decoded = jwtDecode(token);
      setUser({
        username: decoded.username,
        userId: decoded.userId,
        token
      });

      navigate("/skills");
    }
  }, [navigate]);

  const login = async (username, password, remember, recaptchaToken) => {
    try {
      const data = await postLogin(username, password, recaptchaToken);
      const token = data.token;

      if (token) {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);

        setUser({
          username: decoded.username,
          userId: decoded.userId,
          token,
        });

        navigate("/skills");
      }
    } catch {
      const response = error?.response?.data || "Erro ao autenticar. Tente novamente.";
      showModal(response, false, closeAllModals);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateToken = useCallback((novoToken) => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("rememberMe");

    localStorage.setItem("token", novoToken);
    const decoded = jwtDecode(novoToken);

    setUser({ username: decoded.username, token: novoToken, userId: decoded.userId });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, rememberMe, setRememberMe, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
