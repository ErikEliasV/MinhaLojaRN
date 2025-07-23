import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { obterTodosProdutos } from "../servicos/servicoProdutos";
import { ProdutoAPI } from "../tipos/api";
import api from "../api/axiosConfig";

export default function TelaAdminProdutos() {
  const [produtos, setProdutos] = useState<ProdutoAPI[]>([]);
  const [carregando, setCarregando] = useState(true);
  const navegacao = useNavigation();

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const produtosAPI = await obterTodosProdutos();
      setProdutos(produtosAPI);
    } catch (erro) {
      Toast.show({
        type: "error",
        text1: "Erro ao carregar produtos",
        text2: "Tente novamente mais tarde",
      });
    } finally {
      setCarregando(false);
    }
  };

  const excluirProduto = async (id: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`products/${id}`);
              Toast.show({
                type: "success",
                text1: "Produto excluído com sucesso",
              });
              // Remove o produto da lista local
              setProdutos((prev) => prev.filter((p) => p.id !== id));
            } catch (erro) {
              Toast.show({
                type: "error",
                text1: "Erro ao excluir produto",
                text2: "Tente novamente mais tarde",
              });
            }
          },
        },
      ]
    );
  };

  const renderizarProduto = ({ item }: { item: ProdutoAPI }) => (
    <View style={estilos.cardProduto}>
      <View style={estilos.infoProduto}>
        <Text style={estilos.tituloProduto} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={estilos.precoProduto}>R$ {item.price.toFixed(2)}</Text>
        <Text style={estilos.categoriaProduto}>{item.category}</Text>
      </View>
      <View style={estilos.botoesAcao}>
        <TouchableOpacity
          style={[estilos.botaoAcao, estilos.botaoEditar]}
          onPress={() => navegacao.navigate("EditarProduto", { produtoId: item.id })}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={estilos.textoBotaoAcao}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.botaoAcao, estilos.botaoExcluir]}
          onPress={() => excluirProduto(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={estilos.textoBotaoAcao}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando) {
    return (
      <View style={estilos.containerCarregando}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={estilos.textoCarregando}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={estilos.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={estilos.cabecalho}>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => navegacao.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={estilos.titulo}>Gerenciar Produtos</Text>
        <TouchableOpacity
          style={estilos.botaoAdicionar}
          onPress={() => navegacao.navigate("AdicionarProduto")}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={produtos}
        renderItem={renderizarProduto}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={estilos.listaProdutos}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  containerCarregando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  textoCarregando: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
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
  botaoAdicionar: {
    padding: 8,
  },
  listaProdutos: {
    padding: 16,
  },
  cardProduto: {
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
  infoProduto: {
    marginBottom: 12,
  },
  tituloProduto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  precoProduto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  categoriaProduto: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  botoesAcao: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  botaoAcao: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  botaoEditar: {
    backgroundColor: "#007AFF",
  },
  botaoExcluir: {
    backgroundColor: "#dc3545",
  },
  textoBotaoAcao: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
}); 