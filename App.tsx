import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

import TelaLogin from "./src/telas/TelaLogin";
import TelaProdutos from "./src/telas/TelaProdutos";
import TelaDetalhesProduto from "./src/telas/TelaDetalhesProduto"; // Importa a tela de detalhes do produto
import TelaBuscaProdutos  from "./src/telas/TelaBuscaProdutos";
import { obterToken, removerToken } from "./src/servicos/servicoArmazenamento";
import api from "./src/api/axiosConfig";

const Pilha = createNativeStackNavigator(); // Cria uma instância do Stack Navigator para gerenciar as telas.

export default function App() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null); // Estado para controlar a autenticação do usuário (null = verificando, true = autenticado, false = não autenticado).
  const [carregandoInicial, setCarregandoInicial] = useState(true); // Estado para indicar se a verificação inicial de autenticação está em andamento.

  useEffect(() => {
    // Função assíncrona para verificar o status de autenticação do usuário ao iniciar o aplicativo.
    const verificarAutenticacao = async () => {
      const token = await obterToken(); // Tenta obter um token de autenticação armazenado.
      if (token) {
        // Se um token for encontrado, configura o cabeçalho de autorização padrão do Axios.
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAutenticado(true); // Define o usuário como autenticado.
      } else {
        setAutenticado(false); // Define o usuário como não autenticado se não houver token.
      }
      setCarregandoInicial(false); // Finaliza o estado de carregamento inicial.
    };

    verificarAutenticacao(); // Chama a função para verificar a autenticação.
    // O interceptor de resposta já foi configurado em axiosConfig.ts e lida com erros 401 (não autorizado).
    // Ele removerá o token e notificará sobre a expiração da sessão.
  }, []); // O array vazio assegura que este efeito seja executado apenas uma vez, no montagem do componente.

  // Função para lidar com o processo de logout.
  const lidarComLogout = async () => {
    await removerToken(); // Remove o token de autenticação do armazenamento local.
    delete api.defaults.headers.common["Authorization"]; // Remove o token do cabeçalho padrão do Axios.
    setAutenticado(false); // Atualiza o estado de autenticação para falso, redirecionando para a tela de login.
  };

  // Exibe um indicador de carregamento enquanto a verificação inicial de autenticação está em andamento.
  if (carregandoInicial) {
    return (
      <View style={estilos.containerCentral}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Pilha.Navigator screenOptions={{ headerShown: false }}>
        {autenticado ? (
          // Telas acessíveis após o login (usuário autenticado).
          <Pilha.Group>
            <Pilha.Screen
              name="Produtos"
              options={{ title: "Lista de Produtos" }}
            >
              {/* Renderiza a TelaProdutos, passando a função lidarComLogout como prop. */}
              {(props) => <TelaProdutos {...props} aoLogout={lidarComLogout} />}
            </Pilha.Screen>
            <Pilha.Screen
              name="DetalhesProduto"
              options={{ title: "Detalhes do Produto" }}
            >
              {/* Renderiza a TelaDetalhesProduto. O alerta de tipo não interfere no fucionamento. */}
              {(props) => <TelaDetalhesProduto {...props} />}
            </Pilha.Screen>
            <Pilha.Screen
              name="BuscarProdutos"
              options={{ title: "Buscar Produtos" }}
              component={TelaBuscaProdutos}
            />
          </Pilha.Group>
        ) : (
          // Telas acessíveis antes do login (usuário não autenticado).
          <Pilha.Group>
            <Pilha.Screen name="Login" options={{ title: "Entrar" }}>
              {/* Renderiza a TelaLogin, passando uma função para atualizar o estado de autenticação após o login. */}
              {(props) => (
                <TelaLogin
                  {...props}
                  aoLoginSucesso={() => setAutenticado(true)}
                />
              )}
            </Pilha.Screen>
          </Pilha.Group>
        )}
      </Pilha.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

const estilos = StyleSheet.create({
  containerCentral: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});