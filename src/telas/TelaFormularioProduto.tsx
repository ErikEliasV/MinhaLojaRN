import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { ProdutoAPI } from "../tipos/api";
import api from "../api/axiosConfig";

interface Erros {
  title?: string;
  price?: string;
  description?: string;
  category?: string;
  image?: string;
}

export default function TelaFormularioProduto() {
  const navegacao = useNavigation();
  const rota = useRoute();
  const { produtoId } = rota.params || {};
  const modoEdicao = !!produtoId;

  const [carregando, setCarregando] = useState(modoEdicao);
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<Erros>({});

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    if (modoEdicao) {
      carregarProduto();
    }
  }, [produtoId]);

  const carregarProduto = async () => {
    try {
      const resposta = await api.get<ProdutoAPI>(`products/${produtoId}`);
      const { title, price, description, category, image } = resposta.data;
      setFormData({
        title,
        price: price.toString(),
        description,
        category,
        image,
      });
    } catch (erro) {
      Toast.show({
        type: "error",
        text1: "Erro ao carregar produto",
        text2: "Tente novamente mais tarde",
      });
      navegacao.goBack();
    } finally {
      setCarregando(false);
    }
  };

  const validarFormulario = (): boolean => {
    const novosErros: Erros = {};

    if (!formData.title.trim()) {
      novosErros.title = "O título é obrigatório";
    }

    if (!formData.price.trim()) {
      novosErros.price = "O preço é obrigatório";
    } else {
      const preco = parseFloat(formData.price);
      if (isNaN(preco) || preco <= 0) {
        novosErros.price = "O preço deve ser um número positivo";
      }
    }

    if (!formData.description.trim()) {
      novosErros.description = "A descrição é obrigatória";
    }

    if (!formData.category.trim()) {
      novosErros.category = "A categoria é obrigatória";
    }

    if (!formData.image.trim()) {
      novosErros.image = "A URL da imagem é obrigatória";
    } else {
      try {
        new URL(formData.image);
      } catch {
        novosErros.image = "URL da imagem inválida";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvarProduto = async () => {
    if (!validarFormulario()) return;

    setEnviando(true);
    try {
      const dadosParaEnviar = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (modoEdicao) {
        await api.put(`products/${produtoId}`, dadosParaEnviar);
        Toast.show({
          type: "success",
          text1: "Produto atualizado com sucesso",
        });
      } else {
        await api.post("products", dadosParaEnviar);
        Toast.show({
          type: "success",
          text1: "Produto criado com sucesso",
        });
      }
      navegacao.goBack();
    } catch (erro) {
      Toast.show({
        type: "error",
        text1: "Erro ao salvar produto",
        text2: "Tente novamente mais tarde",
      });
    } finally {
      setEnviando(false);
    }
  };

  if (carregando) {
    return (
      <View style={estilos.containerCarregando}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={estilos.textoCarregando}>Carregando produto...</Text>
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
        <Text style={estilos.titulo}>
          {modoEdicao ? "Editar Produto" : "Novo Produto"}
        </Text>
        <View style={estilos.espacador} />
      </View>

      <ScrollView
        style={estilos.conteudo}
        contentContainerStyle={estilos.formulario}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.campo}>
          <Text style={estilos.label}>Título</Text>
          <TextInput
            style={[
              estilos.input,
              erros.title ? estilos.inputErro : null,
            ]}
            value={formData.title}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, title: text }));
              if (erros.title) {
                setErros((prev) => ({ ...prev, title: undefined }));
              }
            }}
            placeholder="Digite o título do produto"
          />
          {erros.title && <Text style={estilos.erro}>{erros.title}</Text>}
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.label}>Preço</Text>
          <TextInput
            style={[
              estilos.input,
              erros.price ? estilos.inputErro : null,
            ]}
            value={formData.price}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, price: text }));
              if (erros.price) {
                setErros((prev) => ({ ...prev, price: undefined }));
              }
            }}
            placeholder="Digite o preço do produto"
            keyboardType="decimal-pad"
          />
          {erros.price && <Text style={estilos.erro}>{erros.price}</Text>}
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.label}>Descrição</Text>
          <TextInput
            style={[
              estilos.input,
              estilos.inputMultiline,
              erros.description ? estilos.inputErro : null,
            ]}
            value={formData.description}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, description: text }));
              if (erros.description) {
                setErros((prev) => ({ ...prev, description: undefined }));
              }
            }}
            placeholder="Digite a descrição do produto"
            multiline
            numberOfLines={4}
          />
          {erros.description && (
            <Text style={estilos.erro}>{erros.description}</Text>
          )}
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.label}>Categoria</Text>
          <TextInput
            style={[
              estilos.input,
              erros.category ? estilos.inputErro : null,
            ]}
            value={formData.category}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, category: text }));
              if (erros.category) {
                setErros((prev) => ({ ...prev, category: undefined }));
              }
            }}
            placeholder="Digite a categoria do produto"
          />
          {erros.category && <Text style={estilos.erro}>{erros.category}</Text>}
        </View>

        <View style={estilos.campo}>
          <Text style={estilos.label}>URL da Imagem</Text>
          <TextInput
            style={[
              estilos.input,
              erros.image ? estilos.inputErro : null,
            ]}
            value={formData.image}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, image: text }));
              if (erros.image) {
                setErros((prev) => ({ ...prev, image: undefined }));
              }
            }}
            placeholder="Digite a URL da imagem do produto"
            autoCapitalize="none"
          />
          {erros.image && <Text style={estilos.erro}>{erros.image}</Text>}
        </View>

        <TouchableOpacity
          style={[estilos.botaoSalvar, enviando && estilos.botaoDesabilitado]}
          onPress={salvarProduto}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={estilos.textoBotaoSalvar}>Salvar</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  espacador: {
    width: 40,
  },
  conteudo: {
    flex: 1,
  },
  formulario: {
    padding: 16,
  },
  campo: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputErro: {
    borderColor: "#dc3545",
  },
  erro: {
    color: "#dc3545",
    fontSize: 14,
    marginTop: 4,
  },
  botaoSalvar: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    gap: 8,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoBotaoSalvar: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
}); 