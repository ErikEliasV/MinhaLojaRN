import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { obterTodosProdutos } from "../servicos/servicoProdutos";
import { ProdutoAPI } from "../tipos/api"; // Reutilize a interface
import { useNavigation } from "@react-navigation/native";

interface TelaProdutosProps {
  aoLogout: () => void;
}

export default function TelaProdutos({ aoLogout }: TelaProdutosProps) {
  const navegacao = useNavigation(); // Adicione esta linha
  const [listaProdutos, setListaProdutos] = useState<ProdutoAPI[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<ProdutoAPI[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");
  const [termoBusca, setTermoBusca] = useState(""); // Estado para o campo de busca

  useEffect(() => {
    const carregarProdutos = async () => {
      setCarregandoProdutos(true);
      setMensagemErro("");
      try {
        const produtos = await obterTodosProdutos();
        setListaProdutos(produtos);
        setProdutosFiltrados(produtos); // Inicialmente, a lista filtrada é a lista completa
      } catch (erro: any) {
        setMensagemErro(
          erro.message || "Não foi possível carregar os produtos."
        );
        // O interceptor do Axios já lida com 401, mas você pode querer um fallback aqui
        if (erro.message.includes("Sessão expirada")) {
          aoLogout(); // Força o logout se a mensagem indicar sessão expirada
        }
      } finally {
        setCarregandoProdutos(false);
      }
    };
    carregarProdutos();
  }, [aoLogout]); // aoLogout como dependência para garantir que a função esteja atualizada

  // Adicione este useEffect dentro do seu componente TelaProdutos
  useEffect(() => {
    if (termoBusca === "") {
      setProdutosFiltrados(listaProdutos);
    } else {
      const produtosEncontrados = listaProdutos.filter(
        (produto) =>
          produto.title.toLowerCase().includes(termoBusca.toLowerCase()) ||
          produto.category.toLowerCase().includes(termoBusca.toLowerCase())
      );
      setProdutosFiltrados(produtosEncontrados);
    }
  }, [termoBusca, listaProdutos]); // Dependências: termoBusca e listaProdutos
  
  const renderizarItemProduto = ({ item }: { item: ProdutoAPI }) => (
    <TouchableOpacity
      style={estilos.itemProduto}
      onPress={() =>
        navegacao.navigate("DetalhesProduto", { produtoId: item.id })
        // O alerta acima não interfere no funcionamento da aplicação.
        // Trata-se apenas de um alerta de tipagem, mas é um código válido para execução.
      }
    >
      <Image source={{ uri: item.image }} style={estilos.imagemProduto} />
      <View style={estilos.detalhesProduto}>
        <Text style={estilos.tituloProduto}>{item.title}</Text>
        <Text style={estilos.categoriaProduto}>{item.category}</Text>
        <Text style={estilos.precoProduto}>R$ {item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (carregandoProdutos) {
    return (
      <View style={estilos.containerCentral}>
        <ActivityIndicator size="large" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  if (mensagemErro) {
    return (
      <View style={estilos.containerCentral}>
        <Text style={estilos.mensagemErro}>{mensagemErro}</Text>
        <TouchableOpacity style={estilos.botaoLogout} onPress={aoLogout}>
          <Text style={estilos.textoBotao}>Fazer Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.tituloPagina}>Produtos</Text>
        <TouchableOpacity style={estilos.botaoLogout} onPress={aoLogout}>
          <Text style={estilos.textoBotao}>Sair</Text>
        </TouchableOpacity>
      </View>
      {/* Campo de busca será adicionado no Passo 7 */}
      <TextInput
        style={estilos.inputBusca}
        placeholder="Pesquisar produtos..."
        value={termoBusca}
        onChangeText={setTermoBusca}
      />
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderizarItemProduto}
        contentContainerStyle={estilos.listaConteudo}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 10 },
  containerCentral: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  tituloPagina: { fontSize: 26 },
  botaoLogout: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
  textoBotao: { fontSize: 14 },
  inputBusca: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  itemProduto: {
    flexDirection: "row",
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  imagemProduto: { width: 60, height: 60, borderRadius: 5, marginRight: 15 },
  detalhesProduto: { flex: 1 },
  tituloProduto: { fontSize: 16, marginBottom: 5 },
  categoriaProduto: { fontSize: 12, marginBottom: 5, opacity: 0.7 },
  precoProduto: { fontSize: 15, fontWeight: "bold" },
  listaConteudo: { paddingBottom: 20 },
  mensagemErro: { textAlign: "center", marginBottom: 20 },
});
