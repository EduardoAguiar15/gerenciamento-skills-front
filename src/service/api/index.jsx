import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {

    const requestType = error.config?.headers["X-Request-Type"];
    const isLoginRequest = requestType === "login";
    const isPasswordResetRequest = requestType === "esqueci-senha";

    if (!isLoginRequest && !isPasswordResetRequest && error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    else if (isLoginRequest && (error.response?.status === 404 || error.response?.status === 401)) {
      return Promise.reject({ message: "Usuário ou senha inválidos." });
    }
    if (error.response?.status && error.response.data?.success === false) {
      return error.response;
    }

    return Promise.reject(error);
  }
);

const getAuthConfig = () => {
  const accessToken = localStorage.getItem("token");
  if (!accessToken) {
    console.warn("Aviso: Token não encontrado, a requisição pode falhar.");
    return {};
  }
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
};

export const postLogin = async (username, password, recaptchaToken) => {
  try {
    const response = await api.post("login", { username, password, recaptchaToken }, { headers: { "X-Request-Type": "login" } });
    const token = response.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Falha ao autenticar. Token ausente.");
    }
    return { token, userData: response.data };
  } catch {
    return;
  }
}

export const postCadastro = (username, password, confirmPassword, recaptchaToken) => {
  return api.post("usuario", {
    email: username,
    senha: password,
    confirmaSenha: confirmPassword,
    recaptchaToken
  });
};

export const putUsuario = async (idUsuario, configuracao) => {
  const response = await api.put(`/usuario/${idUsuario}`, configuracao, getAuthConfig());
  return response;
};

export const postSolicitaRedefinir = async (email, recaptchaToken) => {
  return api.post("/usuario/esqueci-senha", {
    email,
    recaptchaToken
  }, {
    headers: {
      "X-Request-Type": "esqueci-senha"
    }
  });
};

export const postRedefineSenha = async (token, novaSenha, confirmaSenha) => {
  return api.post(`/usuario/redefinir-senha?token=${encodeURIComponent(token)}`, {
    novaSenha: novaSenha,
    confirmaSenha: confirmaSenha
  }, {
    headers: {
      "X-Request-Type": "redefinir-senha"
    }
  });
};

export const deleteUsuario = async (userId) => {
  return api.delete(`/usuario/${userId}`, getAuthConfig());
};

export const getSkills = async () => {
  const response = await api.get("skills", getAuthConfig());
  return response.data;
};

export const postSkillByUsuario = async (idUsuario, configuracao) => {
  const response = await api.post(`/relacionamento/usuario/${idUsuario}/skills`, configuracao, getAuthConfig());
  return response;
};

export const getSkillListByUsuario = async (idUsuario) => {
  const response = await api.get(`/relacionamento/usuario/${idUsuario}/skills`, getAuthConfig());
  return response.data;
};

export const deleteSkillByUsuario = async (userId, skillsId) => {
  const response = await api.delete(`/relacionamento/usuario/${userId}/skills/${skillsId}`, getAuthConfig());
  return response;
};

export const putSkillByUsuario = async (idUsuario, configuracao) => {
  const response = await api.put(`/relacionamento/usuario/${idUsuario}/skills`, configuracao, getAuthConfig());
  return response;
};

export const getSkillByUsuario = async (idUsuario, skillsId) => {
  const response = await api.get(`/relacionamento/usuario/${idUsuario}/skills/${skillsId}`, getAuthConfig());
  return response.data;
};