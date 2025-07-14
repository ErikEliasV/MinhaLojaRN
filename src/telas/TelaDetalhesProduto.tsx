import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { obterProdutoPorId } from "../servicos/servicoProdutos";
import { ProdutoAPI } from "../tipos/api";

// Define os parâmetros esperados para a rota DetalhesProduto.
type DetalhesProdutoRotaParametros = {
  produtoId: number; // Espera um parâmetro 'produtoId' do tipo número.
};

export default function TelaDetalhesProduto() {
  const rota = useRoute(); // Hook para acessar o objeto de rota atual.
  const navegacao = useNavigation(); // Hook para acessar o objeto de navegação.

  // Extrai o 'produtoId' dos parâmetros da rota.
  const { produtoId } = rota.params as DetalhesProdutoRotaParametros;
  const [produto, setProduto] = useState<ProdutoAPI | null>(null); // Estado para armazenar os detalhes do produto.
  const [carregando, setCarregando] = useState(true); // Estado para controlar o indicador de carregamento.
  const [mensagemErro, setMensagemErro] = useState(""); // Estado para exibir mensagens de erro.

  useEffect(() => {
    // Função assíncrona para carregar os detalhes de um produto específico.
    const carregarDetalhesProduto = async () => {
      setCarregando(true); // Ativa o indicador de carregamento.
      setMensagemErro(""); // Limpa mensagens de erro anteriores.
      try {
        const produtoEncontrado = await obterProdutoPorId(produtoId); // Busca o produto pelo ID.
        setProduto(produtoEncontrado); // Armazena os detalhes do produto.
      } catch (erro: any) {
        // Captura e exibe mensagens de erro em caso de falha na busca.
        setMensagemErro(
          erro.message || "Não foi possível carregar os detalhes do produto."
        );
      } finally {
        setCarregando(false); // Desativa o indicador de carregamento.
      }
    };
    carregarDetalhesProduto(); // Chama a função para carregar os detalhes.
  }, [produtoId]); // Recarrega os detalhes se o ID do produto mudar.

  // Exibe um indicador de carregamento enquanto os detalhes do produto estão sendo buscados.
  if (carregando) {
    return (
      <View style={estilos.containerCentral}>
        <ActivityIndicator size="large" />
        <Text>Carregando detalhes do produto...</Text>
      </View>
    );
  }

  // Exibe uma mensagem de erro e um botão para voltar se houver um erro.
  if (mensagemErro) {
    return (
      <View style={estilos.containerCentral}>
        <Text style={estilos.mensagemErro}>{mensagemErro}</Text>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => navegacao.goBack()} // Retorna à tela anterior.
        >
          <Text style={estilos.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Exibe uma mensagem se o produto não for encontrado após o carregamento.
  if (!produto) {
    return (
      <View style={estilos.containerCentral}>
        <Text>Produto não encontrado.</Text>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => navegacao.goBack()} // Retorna à tela anterior.
        >
          <Text style={estilos.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={estilos.container}>
      <TouchableOpacity
        style={estilos.botaoVoltar}
        onPress={() => navegacao.goBack()} // Botão para retornar à tela anterior.
      >
        <Text style={estilos.textoBotao}>{"< Voltar"}</Text>
      </TouchableOpacity>
      <Image source={{ uri: produto.image }} style={estilos.imagemProduto} />
      <Text style={estilos.titulo}>{produto.title}</Text>
      <Text style={estilos.preco}>R$ {produto.price.toFixed(2)}</Text>
      <Text style={estilos.categoria}>{produto.category}</Text>
      <Text style={estilos.descricaoTitulo}>Descrição:</Text>
      <Text style={estilos.descricao}>{produto.description}</Text>
      <View style={estilos.ratingContainer}>
        <Text style={estilos.ratingTexto}>
          Avaliação: {produto.rating.rate} ({produto.rating.count} votos)
        </Text>
      </View>
      {/* Um botão de edição pode ser adicionado aqui em futuras implementações. */}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#f8f8f8", // Cor de fundo leve para a tela.
  },
  containerCentral: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  botaoVoltar: {
    alignSelf: "flex-start",
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "#e0e0e0", // Cor de fundo para o botão de voltar.
  },
  textoBotao: {
    fontSize: 16,
    color: "#333",
  },
  imagemProduto: {
    width: "100%",
    height: 300,
    resizeMode: "contain", // Ajusta a imagem para caber dentro dos limites.
    marginBottom: 20,
    backgroundColor: "#fff", // Fundo branco para a imagem.
    borderRadius: 10, // Bordas arredondadas para a imagem.
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  preco: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#e67e22", // Cor laranja para o preço.
    marginBottom: 10,
  },
  categoria: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
    fontStyle: "italic", // Estilo itálico para a categoria.
  },
  descricaoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
    color: "#333",
  },
  descricao: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: "#555",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#e7f3ff", // Fundo azul claro para o container de avaliação.
    borderRadius: 8,
  },
  ratingTexto: {
    fontSize: 16,
    color: "#3498db", // Cor azul para o texto de avaliação.
    fontWeight: "bold",
  },
  mensagemErro: {
    textAlign: "center",
    marginBottom: 20,
    color: "red",
    fontSize: 16,
  },
});