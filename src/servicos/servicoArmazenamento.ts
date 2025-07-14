import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_TOKEN = "@minhalojarn:token"; // Chave única para armazenar o token no AsyncStorage.

// Função assíncrona para salvar o token de autenticação.
export async function salvarToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(CHAVE_TOKEN, token); // Armazena o token sob a chave definida.
  } catch (erro) {
    console.error("Erro ao salvar token:", erro); // Registra o erro no console.
    throw new Error("Problema ao armazenar suas informações de login."); // Lança um erro para ser tratado pelo chamador.
  }
}

// Função assíncrona para obter o token de autenticação.
export async function obterToken(): Promise<string | null> {
  try {
    const token = await AsyncStorage.getItem(CHAVE_TOKEN); // Tenta recuperar o token.
    return token; // Retorna o token ou null se não for encontrado.
  } catch (erro) {
    console.error("Erro ao obter token:", erro); // Registra o erro no console.
    return null; // Retorna null em caso de erro.
  }
}

// Função assíncrona para remover o token de autenticação.
export async function removerToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CHAVE_TOKEN); // Remove o token associado à chave.
  } catch (erro) {
    console.error("Erro ao remover token:", erro); // Registra o erro no console.
  }
}