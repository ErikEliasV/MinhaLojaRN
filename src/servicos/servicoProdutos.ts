import api from "../api/axiosConfig"; // Importa a instância configurada do Axios.
import { ProdutoAPI } from "../tipos/api"; // Importa a interface ProdutoAPI para tipagem.

// Função assíncrona para obter todos os produtos da API.
export async function obterTodosProdutos(): Promise<ProdutoAPI[]> {
  try {
    const resposta = await api.get<ProdutoAPI[]>("products"); // Faz uma requisição GET para a rota 'products'.
    return resposta.data; // Retorna a lista de produtos.
  } catch (erro: any) {
    // O interceptor do Axios em axiosConfig.ts já lida com o erro 401 (não autorizado).
    // Aqui, lança um erro genérico se a busca de produtos falhar por outras razões.
    throw new Error(erro.message || "Erro ao buscar produtos.");
  }
}

// Função assíncrona para obter os detalhes de um produto específico por ID.
export async function obterProdutoPorId(id: number): Promise<ProdutoAPI> {
  try {
    const resposta = await api.get<ProdutoAPI>(`products/${id}`); // Faz uma requisição GET para a rota de detalhes do produto.
    return resposta.data; // Retorna os detalhes do produto.
  } catch (erro: any) {
    // Tratamento de erro específico para produto não encontrado (status 404).
    if (erro.response && erro.response.status === 404) {
      throw new Error("Produto não encontrado.");
    }
    // Para outros erros, lança uma mensagem genérica.
    throw new Error(erro.message || "Erro ao buscar detalhes do produto.");
  }
}

export interface NovoProduto {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export async function criarProduto(produto: NovoProduto): Promise<ProdutoAPI> {
  try {
    const resposta = await api.post<ProdutoAPI>("products", produto);
    return resposta.data;
  } catch (erro: any) {
    throw new Error(erro.message || "Erro ao criar produto.");
  }
}

export async function atualizarProduto(id: number, produto: NovoProduto): Promise<ProdutoAPI> {
  try {
    const resposta = await api.put<ProdutoAPI>(`products/${id}`, produto);
    return resposta.data;
  } catch (erro: any) {
    if (erro.response && erro.response.status === 404) {
      throw new Error("Produto não encontrado.");
    }
    throw new Error(erro.message || "Erro ao atualizar produto.");
  }
}

export async function excluirProduto(id: number): Promise<void> {
  try {
    await api.delete(`products/${id}`);
  } catch (erro: any) {
    if (erro.response && erro.response.status === 404) {
      throw new Error("Produto não encontrado.");
    }
    throw new Error(erro.message || "Erro ao excluir produto.");
  }
}