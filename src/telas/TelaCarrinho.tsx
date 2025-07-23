import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useCarrinho } from "../contextos/CarrinhoContext";
import { ItemCarrinho, CarrinhoAPI } from "../tipos/carrinho";
import api from "../api/axiosConfig";

export default function TelaCarrinho() {
  const navegacao = useNavigation();
  const { estado, removerItem, atualizarQuantidade, limparCarrinho } = useCarrinho();
  const [finalizandoCompra, setFinalizandoCompra] = useState(false);

  const testarRemoverItem = (itemId: number, itemTitle: string) => {
    console.log("Tentando remover item:", itemId, itemTitle);
    try {
      removerItem(itemId);
      console.log("Item removido com sucesso");
      Toast.show({
        type: "success",
        text1: "Item removido",
        text2: itemTitle,
      });
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  const testarLimparCarrinho = () => {
    console.log("Tentando limpar carrinho");
    try {
      limparCarrinho();
      console.log("Carrinho limpo com sucesso");
      Toast.show({
        type: "success",
        text1: "Carrinho limpo",
      });
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
    }
  };

  const finalizarCompra = async () => {
    console.log("Iniciando finalização da compra");
    console.log("Estado do carrinho:", estado);

    if (estado.itens.length === 0) {
      console.log("Carrinho vazio");
      Toast.show({
        type: "info",
        text1: "Carrinho vazio",
        text2: "Adicione produtos antes de finalizar a compra",
      });
      return;
    }

    setFinalizandoCompra(true);
    console.log("Finalizando compra...");

    try {
      const dadosCarrinho: CarrinhoAPI = {
        userId: 1,
        products: estado.itens.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      console.log("Dados do carrinho para API:", dadosCarrinho);
      
      // Simular sucesso direto para teste
      console.log("Simulando compra finalizada");
      
      Toast.show({
        type: "success",
        text1: "🎉 Compra finalizada!",
        text2: `Total: R$ ${estado.total.toFixed(2)}`,
        visibilityTime: 5000,
      });

      console.log("Toast exibido, limpando carrinho");
      limparCarrinho();
      
      console.log("Aguardando 3 segundos antes de voltar");
      setTimeout(() => {
        console.log("Voltando para tela anterior");
        navegacao.goBack();
      }, 3000);
      
    } catch (erro: any) {
      console.error("Erro na finalização:", erro);
      Toast.show({
        type: "error",
        text1: "Erro na compra",
        text2: "Tente novamente",
      });
    } finally {
      setFinalizandoCompra(false);
      console.log("Finalização concluída");
    }
  };

  const renderizarItem = ({ item }: { item: ItemCarrinho }) => (
    <View style={estilos.itemCarrinho}>
      <Image source={{ uri: item.image }} style={estilos.imagemItem} />
      
      <View style={estilos.detalhesItem}>
        <Text style={estilos.tituloItem} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={estilos.precoItem}>
          R$ {item.price.toFixed(2)} cada
        </Text>
        
        <View style={estilos.controles}>
          <View style={estilos.controlesQuantidade}>
            <TouchableOpacity
              style={estilos.botaoQuantidade}
              onPress={() => {
                console.log("Diminuindo quantidade do item:", item.id);
                atualizarQuantidade(item.id, item.quantity - 1);
              }}
            >
              <Ionicons name="remove" size={16} color="#666" />
            </TouchableOpacity>
            
            <Text style={estilos.quantidade}>{item.quantity}</Text>
            
            <TouchableOpacity
              style={estilos.botaoQuantidade}
              onPress={() => {
                console.log("Aumentando quantidade do item:", item.id);
                atualizarQuantidade(item.id, item.quantity + 1);
              }}
            >
              <Ionicons name="add" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={estilos.botaoRemoverTexto}
            onPress={() => {
              console.log("Clicou em remover item:", item.id);
              testarRemoverItem(item.id, item.title);
            }}
          >
            <Text style={estilos.textoRemover}>Remover</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={estilos.subtotalContainer}>
        <Text style={estilos.subtotal}>
          R$ {(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  const renderizarCarrinhoVazio = () => (
    <View style={estilos.carrinhoVazio}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={estilos.textoCarrinhoVazio}>Seu carrinho está vazio</Text>
      <Text style={estilos.subtextoCarrinhoVazio}>
        Adicione produtos para começar suas compras
      </Text>
      <TouchableOpacity
        style={estilos.botaoContinuarComprando}
        onPress={() => {
          console.log("Voltando para produtos");
          navegacao.goBack();
        }}
      >
        <Text style={estilos.textoBotaoContinuar}>Continuar Comprando</Text>
      </TouchableOpacity>
    </View>
  );

  console.log("Renderizando TelaCarrinho, itens:", estado.itens.length);

  return (
    <SafeAreaView style={estilos.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <View style={estilos.cabecalho}>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => {
            console.log("Clicou em voltar");
            navegacao.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={estilos.titulo}>
          Carrinho {estado.itens.length > 0 && `(${estado.quantidadeTotal})`}
        </Text>
        
        {estado.itens.length > 0 && (
          <TouchableOpacity
            style={estilos.botaoLimparTexto}
            onPress={() => {
              console.log("Clicou em limpar carrinho");
              testarLimparCarrinho();
            }}
          >
            <Text style={estilos.textoLimpar}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {estado.itens.length === 0 ? (
        renderizarCarrinhoVazio()
      ) : (
        <>
          <FlatList
            data={estado.itens}
            renderItem={renderizarItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={estilos.listaItens}
            showsVerticalScrollIndicator={false}
          />
          
          <View style={estilos.rodape}>
            <View style={estilos.resumo}>
              <View style={estilos.linhaResumo}>
                <Text style={estilos.textoResumo}>
                  {estado.quantidadeTotal} {estado.quantidadeTotal === 1 ? 'item' : 'itens'}
                </Text>
                <Text style={estilos.valorResumo}>
                  R$ {estado.total.toFixed(2)}
                </Text>
              </View>
              
              <View style={estilos.linhaTotal}>
                <Text style={estilos.textoTotal}>Total</Text>
                <Text style={estilos.valorTotal}>
                  R$ {estado.total.toFixed(2)}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[estilos.botaoFinalizar, finalizandoCompra && estilos.botaoDesabilitado]}
              onPress={() => {
                console.log("Clicou em finalizar compra");
                finalizarCompra();
              }}
              disabled={finalizandoCompra}
            >
              {finalizandoCompra ? (
                <>
                  <ActivityIndicator color="#fff" />
                  <Text style={estilos.textoBotaoFinalizar}>Processando...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="card-outline" size={20} color="#fff" />
                  <Text style={estilos.textoBotaoFinalizar}>Finalizar Compra</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  botaoVoltar: {
    padding: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  botaoLimparTexto: {
    padding: 8,
    backgroundColor: "#dc3545",
    borderRadius: 6,
  },
  textoLimpar: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  listaItens: {
    padding: 16,
  },
  itemCarrinho: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  imagemItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  detalhesItem: {
    flex: 1,
    marginLeft: 12,
  },
  tituloItem: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  precoItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  controles: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlesQuantidade: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  botaoQuantidade: {
    padding: 8,
  },
  quantidade: {
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  botaoRemoverTexto: {
    padding: 8,
    backgroundColor: "#dc3545",
    borderRadius: 6,
  },
  textoRemover: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  subtotalContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginLeft: 8,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  carrinhoVazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  textoCarrinhoVazio: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  subtextoCarrinhoVazio: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
  },
  botaoContinuarComprando: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  textoBotaoContinuar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  rodape: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  resumo: {
    marginBottom: 16,
  },
  linhaResumo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  textoResumo: {
    fontSize: 16,
    color: "#666",
  },
  valorResumo: {
    fontSize: 16,
    color: "#666",
  },
  linhaTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  textoTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  valorTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  botaoFinalizar: {
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotaoFinalizar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
}); 