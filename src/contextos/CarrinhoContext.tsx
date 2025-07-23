import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { EstadoCarrinho, AcaoCarrinho, ItemCarrinho } from '../tipos/carrinho';

// Estado inicial do carrinho
const estadoInicial: EstadoCarrinho = {
  itens: [],
  total: 0,
  quantidadeTotal: 0,
};

// Função para calcular totais
const calcularTotais = (itens: ItemCarrinho[]) => {
  const total = itens.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const quantidadeTotal = itens.reduce((acc, item) => acc + item.quantity, 0);
  return { total, quantidadeTotal };
};

// Reducer do carrinho
const carrinhoReducer = (estado: EstadoCarrinho, acao: AcaoCarrinho): EstadoCarrinho => {
  switch (acao.type) {
    case 'ADICIONAR_ITEM': {
      const itemExistente = estado.itens.find(item => item.id === acao.payload.id);
      
      let novosItens: ItemCarrinho[];
      if (itemExistente) {
        // Se o item já existe, aumenta a quantidade
        novosItens = estado.itens.map(item =>
          item.id === acao.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Se é um novo item, adiciona com quantidade 1
        novosItens = [...estado.itens, { ...acao.payload, quantity: 1 }];
      }
      
      const { total, quantidadeTotal } = calcularTotais(novosItens);
      return { itens: novosItens, total, quantidadeTotal };
    }

    case 'REMOVER_ITEM': {
      const novosItens = estado.itens.filter(item => item.id !== acao.payload.id);
      const { total, quantidadeTotal } = calcularTotais(novosItens);
      return { itens: novosItens, total, quantidadeTotal };
    }

    case 'ATUALIZAR_QUANTIDADE': {
      if (acao.payload.quantity <= 0) {
        // Se quantidade é 0 ou negativa, remove o item
        const novosItens = estado.itens.filter(item => item.id !== acao.payload.id);
        const { total, quantidadeTotal } = calcularTotais(novosItens);
        return { itens: novosItens, total, quantidadeTotal };
      }

      const novosItens = estado.itens.map(item =>
        item.id === acao.payload.id
          ? { ...item, quantity: acao.payload.quantity }
          : item
      );
      
      const { total, quantidadeTotal } = calcularTotais(novosItens);
      return { itens: novosItens, total, quantidadeTotal };
    }

    case 'LIMPAR_CARRINHO':
      return estadoInicial;

    default:
      return estado;
  }
};

// Interface do contexto
interface CarrinhoContextType {
  estado: EstadoCarrinho;
  adicionarItem: (item: Omit<ItemCarrinho, 'quantity'>) => void;
  removerItem: (id: number) => void;
  atualizarQuantidade: (id: number, quantity: number) => void;
  limparCarrinho: () => void;
}

// Criação do contexto
const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

// Provider do contexto
interface CarrinhoProviderProps {
  children: ReactNode;
}

export const CarrinhoProvider: React.FC<CarrinhoProviderProps> = ({ children }) => {
  const [estado, dispatch] = useReducer(carrinhoReducer, estadoInicial);

  const adicionarItem = (item: Omit<ItemCarrinho, 'quantity'>) => {
    dispatch({ type: 'ADICIONAR_ITEM', payload: item });
  };

  const removerItem = (id: number) => {
    dispatch({ type: 'REMOVER_ITEM', payload: { id } });
  };

  const atualizarQuantidade = (id: number, quantity: number) => {
    dispatch({ type: 'ATUALIZAR_QUANTIDADE', payload: { id, quantity } });
  };

  const limparCarrinho = () => {
    dispatch({ type: 'LIMPAR_CARRINHO' });
  };

  return (
    <CarrinhoContext.Provider
      value={{
        estado,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useCarrinho = (): CarrinhoContextType => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
}; 