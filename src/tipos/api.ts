// Define a interface para as credenciais de login.
export interface CredenciaisLogin {
  usuario: string;
  senha: string;
}

// Define a interface para a resposta da API de login.
export interface RespostaLoginAPI {
  token: string; // O token de autenticação retornado pela API.
}

// Define a interface para a estrutura de um objeto Produto retornado pela API.
export interface ProdutoAPI {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number; // Avaliação média do produto.
    count: number; // Número de avaliações.
  };
}