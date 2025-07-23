import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { obterTodosProdutos } from "../servicos/servicoProdutos";
import { ProdutoAPI } from "../tipos/api";

export default function TelaBuscaProdutos() {
  const [produtos, setProdutos] = useState<ProdutoAPI[]>([]);
  const [termoDigitado, setTermoDigitado] = useState("");
  const [produtosEncontrados, setProdutosEncontrados] = useState<ProdutoAPI[]>([]);
  const [carregando, setCarregando] = useState(true);
  const navegacao = useNavigation();

  useEffect(() => {
    carregarProdutos();
  }, []);

  useEffect(() => {
    filtrarProdutos();
  }, [termoDigitado, produtos]);

  const carregarProdutos = async () => {
    try {
      const produtosAPI = await obterTodosProdutos();
      setProdutos(produtosAPI);
    } catch (erro) {
      Toast.show({
        type: "error",
        text1: "Erro ao carregar produtos",
        text2: "Por favor, tente novamente mais tarde",
      });
    } finally {
      setCarregando(false);
    }
  };

  const filtrarProdutos = () => {
    if (!termoDigitado.trim()) {
      setProdutosEncontrados([]);
      return;
    }

    const resultados = produtos.filter((produto) =>
      produto.title.toLowerCase().includes(termoDigitado.toLowerCase()) ||
      produto.description.toLowerCase().includes(termoDigitado.toLowerCase()) ||
      produto.category.toLowerCase().includes(termoDigitado.toLowerCase())
    );

    setProdutosEncontrados(resultados);

    if (resultados.length === 0 && termoDigitado !== "") {
      Toast.show({
        type: "info",
        text1: "Nenhum resultado encontrado",
        text2: `Para "${termoDigitado}"`,
      });
    }
  };

  const renderizarProduto = ({ item }: { item: ProdutoAPI }) => (
    <TouchableOpacity
      style={estilos.cardProduto}
      onPress={() => navegacao.navigate("DetalhesProduto", { produtoId: item.id })}
    >
      <Image source={{ uri: item.image }} style={estilos.imagemProduto} />
      <View style={estilos.infoProduto}>
        <Text style={estilos.tituloProduto} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={estilos.infoAdicional}>
          <Text style={estilos.categoriaProduto}>{item.category}</Text>
          <View style={estilos.avaliacaoContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={estilos.avaliacaoTexto}>
              {item.rating.rate} ({item.rating.count})
            </Text>
          </View>
        </View>
        <Text style={estilos.precoProduto}>
          R$ {item.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
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
        <View style={estilos.containerBusca}>
          <Ionicons name="search" size={20} color="#666" style={estilos.iconeBusca} />
          <TextInput
            style={estilos.input}
            autoCapitalize="none"
            placeholder="Buscar produtos..."
            value={termoDigitado}
            onChangeText={setTermoDigitado}
            placeholderTextColor="#666"
          />
          {termoDigitado.length > 0 && (
            <TouchableOpacity
              style={estilos.botaoLimpar}
              onPress={() => setTermoDigitado("")}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={produtosEncontrados}
        renderItem={renderizarProduto}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={estilos.listaProdutos}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          termoDigitado.trim() ? (
            <View style={estilos.containerMensagemVazia}>
              <Ionicons name="search-outline" size={48} color="#666" />
              <Text style={estilos.mensagemVazia}>
                Nenhum produto encontrado
              </Text>
              <Text style={estilos.submensagemVazia}>
                Tente buscar com outras palavras
              </Text>
            </View>
          ) : (
            <View style={estilos.containerMensagemVazia}>
              <Ionicons name="search" size={48} color="#666" />
              <Text style={estilos.mensagemVazia}>
                Digite algo para buscar produtos
              </Text>
            </View>
          )
        }
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
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  botaoVoltar: {
    padding: 8,
    marginRight: 8,
  },
  containerBusca: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  iconeBusca: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  botaoLimpar: {
    padding: 8,
  },
  listaProdutos: {
    padding: 16,
  },
  cardProduto: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
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
  imagemProduto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  infoProduto: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  tituloProduto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  infoAdicional: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  categoriaProduto: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  avaliacaoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avaliacaoTexto: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  precoProduto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  containerMensagemVazia: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  mensagemVazia: {
    marginTop: 16,
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  submensagemVazia: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});