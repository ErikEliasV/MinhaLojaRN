import api from "../api/axiosConfig"; // Importa a instância configurada do Axios.
import { CredenciaisLogin, RespostaLoginAPI } from "../tipos/api"; // Importa as interfaces de tipagem.

// Função assíncrona para realizar o login na API.
export async function realizarLogin(
  credenciais: CredenciaisLogin
): Promise<RespostaLoginAPI> {
  try {
    // A Fake Store API espera 'username' e 'password' no corpo da requisição de login.
    const resposta = await api.post<RespostaLoginAPI>("auth/login", {
      username: credenciais.usuario, // Mapeia 'usuario' para 'username'.
      password: credenciais.senha, // Mapeia 'senha' para 'password'.
    });
    return resposta.data; // Retorna os dados da resposta da API (que contém o token).
  } catch (erro: any) {
    // Tratamento de erro específico para requisições Axios.
    if (erro.response && erro.response.status === 401) {
      // Se a resposta da API for 401 (Não Autorizado), indica credenciais inválidas.
      throw new Error("Credenciais inválidas. Verifique seu usuário e senha.");
    }
    // Para outros erros, lança uma mensagem genérica de falha de conexão.
    throw new Error(
      "Erro ao conectar com o servidor. Tente novamente mais tarde."
    );
  }
}