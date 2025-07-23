import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { obterProdutoPorId } from "../servicos/servicoProdutos";
import { ProdutoAPI } from "../tipos/api";

type DetalhesProdutoRotaParametros = {
  produtoId: number;
};

export default function TelaDetalhesProduto() {
  const rota = useRoute();
  const navegacao = useNavigation();
  const { produtoId } = rota.params as DetalhesProdutoRotaParametros;
  const [produto, setProduto] = useState<ProdutoAPI | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    const carregarDetalhesProduto = async () => {
      setCarregando(true);
      setMensagemErro("");
      try {
        const produtoEncontrado = await obterProdutoPorId(produtoId);
        setProduto(produtoEncontrado);
      } catch (erro: any) {
        setMensagemErro(
          erro.message || "Não foi possível carregar os detalhes do produto."
        );
      } finally {
        setCarregando(false);
      }
    };
    carregarDetalhesProduto();
  }, [produtoId]);

  if (carregando) {
    return (
      <SafeAreaView style={estilos.containerCentral}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={estilos.textoCarregando}>
          Carregando detalhes do produto...
        </Text>
      </SafeAreaView>
    );
  }

  if (mensagemErro) {
    return (
      <SafeAreaView style={estilos.containerCentral}>
        <Text style={estilos.mensagemErro}>{mensagemErro}</Text>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => navegacao.goBack()}
        >
          <Text style={estilos.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!produto) {
    return (
      <SafeAreaView style={estilos.containerCentral}>
        <Text style={estilos.mensagemErro}>Produto não encontrado.</Text>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => navegacao.goBack()}
        >
          <Text style={estilos.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView style={estilos.scrollView} showsVerticalScrollIndicator={false}>
        <View style={estilos.cabecalho}>
          <TouchableOpacity
            style={estilos.botaoVoltar}
            onPress={() => navegacao.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={estilos.containerImagem}>
          <Image source={{ uri: produto.image }} style={estilos.imagemProduto} />
        </View>

        <View style={estilos.conteudo}>
          <View style={estilos.categoriaContainer}>
            <Text style={estilos.categoria}>{produto.category}</Text>
          </View>

          <Text style={estilos.titulo}>{produto.title}</Text>

          <View style={estilos.avaliacaoContainer}>
            <View style={estilos.estrelas}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={estilos.avaliacaoTexto}>{produto.rating.rate}</Text>
            </View>
            <Text style={estilos.avaliacoesContagem}>
              ({produto.rating.count} avaliações)
            </Text>
          </View>

          <Text style={estilos.preco}>R$ {produto.price.toFixed(2)}</Text>

          <View style={estilos.secaoDescricao}>
            <Text style={estilos.descricaoTitulo}>Descrição</Text>
            <Text style={estilos.descricao}>{produto.description}</Text>
          </View>

          <TouchableOpacity style={estilos.botaoComprar}>
            <Text style={estilos.textoBotaoComprar}>Adicionar ao Carrinho</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  containerCentral: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  textoCarregando: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  cabecalho: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  botaoVoltar: {
    padding: 8,
  },
  containerImagem: {
    width: width,
    height: width,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  imagemProduto: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: "contain",
  },
  conteudo: {
    padding: 16,
  },
  categoriaContainer: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  categoria: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: "hidden",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  avaliacaoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  estrelas: {
    flexDirection: "row",
    alignItems: "center",
  },
  avaliacaoTexto: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  avaliacoesContagem: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  preco: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 20,
  },
  secaoDescricao: {
    marginBottom: 24,
  },
  descricaoTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  descricao: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  botaoComprar: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  textoBotaoComprar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mensagemErro: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 16,
  },
  textoBotao: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});