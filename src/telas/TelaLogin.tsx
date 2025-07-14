import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { realizarLogin } from "../servicos/servicoAutenticacao";
import { salvarToken } from "../servicos/servicoArmazenamento";

// Define as propriedades esperadas para o componente TelaLogin.
interface TelaLoginProps {
  aoLoginSucesso: () => void; // Função de callback para notificar o componente pai sobre o sucesso do login.
}

export default function TelaLogin({ aoLoginSucesso }: TelaLoginProps) {
  const [nomeUsuario, setNomeUsuario] = useState(""); // Estado para armazenar o nome de usuário digitado.
  const [senhaUsuario, setSenhaUsuario] = useState(""); // Estado para armazenar a senha digitada.
  const [carregando, setCarregando] = useState(false); // Estado para controlar o indicador de carregamento.
  const [mensagemErro, setMensagemErro] = useState(""); // Estado para exibir mensagens de erro.

  // Função assíncrona para lidar com o processo de login.
  const lidarComLogin = async () => {
    setCarregando(true); // Ativa o indicador de carregamento.
    setMensagemErro(""); // Limpa qualquer mensagem de erro anterior.

    try {
      // Credenciais de teste da Fake Store API: 'mor_2314' (usuário) e '83r5^' (senha)
      const resposta = await realizarLogin({
        usuario: nomeUsuario,
        senha: senhaUsuario,
      });
      await salvarToken(resposta.token); // Salva o token de autenticação recebido.
      aoLoginSucesso(); // Chama a função de callback para indicar o sucesso do login.
    } catch (erro: any) {
      // Captura e exibe mensagens de erro em caso de falha no login.
      setMensagemErro(erro.message || "Erro inesperado. Tente novamente.");
    } finally {
      setCarregando(false); // Desativa o indicador de carregamento, independentemente do resultado.
    }
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Login</Text>
      <TextInput
        style={estilos.input}
        placeholder="Nome de Usuário"
        value={nomeUsuario}
        onChangeText={setNomeUsuario}
        autoCapitalize="none" // Desabilita a capitalização automática.
      />
      <TextInput
        style={estilos.input}
        placeholder="Senha"
        value={senhaUsuario}
        onChangeText={setSenhaUsuario}
        secureTextEntry // Oculta o texto digitado para senhas.
      />
      {carregando ? (
        <ActivityIndicator size="large" /> // Exibe o indicador de carregamento enquanto o login está em andamento.
      ) : (
        <TouchableOpacity
          style={estilos.botao}
          onPress={lidarComLogin}
          // Desabilita o botão se o nome de usuário ou a senha estiverem vazios.
          disabled={!nomeUsuario || !senhaUsuario}
        >
          <Text style={estilos.textoBotao}>Entrar</Text>
        </TouchableOpacity>
      )}
      {mensagemErro ? (
        <Text style={estilos.mensagemErro}>{mensagemErro}</Text> // Exibe a mensagem de erro, se houver.
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titulo: { fontSize: 24, marginBottom: 20 },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  botao: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007bff", // Cor de fundo do botão.
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  textoBotao: { color: "#fff", fontSize: 16 }, // Cor do texto do botão.
  mensagemErro: { marginTop: 15, textAlign: "center", color: "red" }, // Estilo para mensagens de erro.
});