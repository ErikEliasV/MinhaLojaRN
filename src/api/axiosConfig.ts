import axios from "axios";
import { obterToken, removerToken } from "../servicos/servicoArmazenamento";

const api = axios.create({
  baseURL: "https://fakestoreapi.com/", // URL base para todas as requisições da API.
  timeout: 10000, // Tempo limite (em ms) para as requisições HTTP.
  headers: {
    "Content-Type": "application/json", // Define o tipo de conteúdo padrão para JSON.
  },
});

// Interceptor de requisição: Adiciona o token de autorização antes de cada requisição.
api.interceptors.request.use(
  async (config) => {
    const token = await obterToken(); // Obtém o token armazenado localmente.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adiciona o token ao cabeçalho de autorização.
    }
    return config; // Retorna a configuração da requisição modificada.
  },
  (erro) => {
    return Promise.reject(erro); // Rejeita a promessa em caso de erro na requisição.
  }
);

// Interceptor de resposta: Lida com respostas da API, especialmente erros 401 (Não Autorizado).
api.interceptors.response.use(
  (response) => response, // Se a resposta for bem-sucedida, retorna-a sem modificação.
  async (erro) => {
    // Verifica se o erro é uma resposta HTTP e se o status é 401.
    if (erro.response && erro.response.status === 401) {
      // Se o token for inválido ou expirado (erro 401), remove-o do armazenamento local.
      await removerToken();
      // Em um cenário real, você poderia disparar um evento global para forçar o logout e redirecionar o usuário.
      console.warn("Token de autenticação expirado ou inválido. Realize o login novamente.");
    }
    return Promise.reject(erro); // Rejeita a promessa para propagar o erro.
  }
);

export default api; // Exporta a instância configurada do Axios para uso em outros módulos.