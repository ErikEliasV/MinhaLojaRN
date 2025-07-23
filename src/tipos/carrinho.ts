export interface ItemCarrinho {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface EstadoCarrinho {
  itens: ItemCarrinho[];
  total: number;
  quantidadeTotal: number;
}

export type AcaoCarrinho = 
  | { type: 'ADICIONAR_ITEM'; payload: Omit<ItemCarrinho, 'quantity'> }
  | { type: 'REMOVER_ITEM'; payload: { id: number } }
  | { type: 'ATUALIZAR_QUANTIDADE'; payload: { id: number; quantity: number } }
  | { type: 'LIMPAR_CARRINHO' };

export interface CarrinhoAPI {
  userId: number;
  products: Array<{
    productId: number;
    quantity: number;
  }>;
} 