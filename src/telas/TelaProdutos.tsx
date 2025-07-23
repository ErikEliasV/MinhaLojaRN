import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { obterTodosProdutos } from "../servicos/servicoProdutos";
import { ProdutoAPI } from "../tipos/api";
import { useNavigation } from "@react-navigation/native";

interface TelaProdutosProps {
  aoLogout: () => void;
}

export default function TelaProdutos({ aoLogout }: TelaProdutosProps) {
  const navegacao = useNavigation();
  const [listaProdutos, setListaProdutos] = useState<ProdutoAPI[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");

  useEffect(() => {
    const carregarProdutos = async () => {
      setCarregandoProdutos(true);
      setMensagemErro("");
      try {
        const produtos = await obterTodosProdutos();
        setListaProdutos(produtos);
      } catch (erro: any) {
        setMensagemErro(
          erro.message || "Não foi possível carregar os produtos."
        );
        if (erro.message.includes("Sessão expirada")) {
          aoLogout();
        }
      } finally {
        setCarregandoProdutos(false);
      }
    };
    carregarProdutos();
  }, [aoLogout]);

  const renderizarItemProduto = ({ item }: { item: ProdutoAPI }) => (
    <TouchableOpacity
      style={estilos.itemProduto}
      onPress={() =>
        navegacao.navigate("DetalhesProduto", { produtoId: item.id })
      }
    >
      <Image source={{ uri: item.image }} style={estilos.imagemProduto} />
      <View style={estilos.detalhesProduto}>
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
        <Text style={estilos.precoProduto}>R$ {item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (carregandoProdutos) {
    return (
      <SafeAreaView style={estilos.containerCentral}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={estilos.textoCarregando}>Carregando produtos...</Text>
      </SafeAreaView>
    );
  }

  if (mensagemErro) {
    return (
      <SafeAreaView style={estilos.containerCentral}>
        <Text style={estilos.mensagemErro}>{mensagemErro}</Text>
        <TouchableOpacity style={estilos.botaoLogout} onPress={aoLogout}>
          <Text style={estilos.textoBotao}>Fazer Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={estilos.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={estilos.cabecalho}>
        <Text style={estilos.tituloPagina}>Produtos</Text>
        <View style={estilos.acoesCabecalho}>
          <TouchableOpacity
            style={estilos.botaoBusca}
            onPress={() => navegacao.navigate("BuscarProdutos")}
          >
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={estilos.botaoLogout} onPress={aoLogout}>
            <Ionicons name="log-out-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={listaProdutos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderizarItemProduto}
        contentContainerStyle={estilos.listaConteudo}
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
  containerCentral: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  textoCarregando: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  acoesCabecalho: {
    flexDirection: "row",
    alignItems: "center",
  },
  tituloPagina: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  botaoBusca: {
    padding: 8,
    marginRight: 8,
  },
  botaoLogout: {
    padding: 8,
  },
  listaConteudo: {
    padding: 16,
  },
  itemProduto: {
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
  detalhesProduto: {
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
  mensagemErro: {
    fontSize: 16,
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 20,
  },
  textoBotao: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});
