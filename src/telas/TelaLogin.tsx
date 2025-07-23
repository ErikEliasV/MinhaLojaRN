import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { realizarLogin } from "../servicos/servicoAutenticacao";
import { salvarToken } from "../servicos/servicoArmazenamento";

interface TelaLoginProps {
  aoLoginSucesso: () => void;
}

export default function TelaLogin({ aoLoginSucesso }: TelaLoginProps) {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senhaUsuario, setSenhaUsuario] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const lidarComLogin = async () => {
    setCarregando(true);
    setMensagemErro("");

    try {
      const resposta = await realizarLogin({
        usuario: nomeUsuario,
        senha: senhaUsuario,
      });
      await salvarToken(resposta.token);
      aoLoginSucesso();
    } catch (erro: any) {
      setMensagemErro(erro.message || "Erro inesperado. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={estilos.container}>
      <View style={estilos.formulario}>
        <Text style={estilos.titulo}>Bem-vindo(a)</Text>
        <Text style={estilos.subtitulo}>Faça login para continuar</Text>

        <View style={estilos.campoInput}>
          <Ionicons name="person-outline" size={20} color="#666" style={estilos.iconeInput} />
          <TextInput
            style={estilos.input}
            placeholder="Nome de usuário"
            value={nomeUsuario}
            onChangeText={setNomeUsuario}
            autoCapitalize="none"
            placeholderTextColor="#666"
          />
        </View>

        <View style={estilos.campoInput}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={estilos.iconeInput} />
          <TextInput
            style={[estilos.input, { paddingRight: 40 }]}
            placeholder="Senha"
            value={senhaUsuario}
            onChangeText={setSenhaUsuario}
            secureTextEntry={!mostrarSenha}
            placeholderTextColor="#666"
          />
          <TouchableOpacity
            style={estilos.botaoOlho}
            onPress={() => setMostrarSenha(!mostrarSenha)}
          >
            <Ionicons
              name={mostrarSenha ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {mensagemErro ? (
          <Text style={estilos.mensagemErro}>{mensagemErro}</Text>
        ) : null}

        {carregando ? (
          <ActivityIndicator size="large" color="#007AFF" style={estilos.carregando} />
        ) : (
          <TouchableOpacity
            style={[
              estilos.botao,
              (!nomeUsuario || !senhaUsuario) && estilos.botaoDesabilitado,
            ]}
            onPress={lidarComLogin}
            disabled={!nomeUsuario || !senhaUsuario}
          >
            <Text style={estilos.textoBotao}>Entrar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  formulario: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  campoInput: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  iconeInput: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#333",
  },
  botaoOlho: {
    padding: 10,
    position: "absolute",
    right: 0,
  },
  botao: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  botaoDesabilitado: {
    backgroundColor: "#ccc",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mensagemErro: {
    color: "#dc3545",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  carregando: {
    marginTop: 20,
  },
});