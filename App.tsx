import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

import TelaLogin from "./src/telas/TelaLogin";
import TelaProdutos from "./src/telas/TelaProdutos";
import TelaDetalhesProduto from "./src/telas/TelaDetalhesProduto";
import TelaBuscaProdutos from "./src/telas/TelaBuscaProdutos";
import TelaAdminProdutos from "./src/telas/TelaAdminProdutos";
import TelaFormularioProduto from "./src/telas/TelaFormularioProduto";
import TelaCarrinho from "./src/telas/TelaCarrinho";
import { CarrinhoProvider } from "./src/contextos/CarrinhoContext";
import { obterToken, removerToken } from "./src/servicos/servicoArmazenamento";
import api from "./src/api/axiosConfig";

const Pilha = createNativeStackNavigator();

export default function App() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [usuarioAdmin, setUsuarioAdmin] = useState(false);

  useEffect(() => {
    const verificarAutenticacao = async () => {
      const token = await obterToken();
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAutenticado(true);
        // Simula verificação de admin - na Fake Store API, vamos considerar todos como admin
        setUsuarioAdmin(true);
      } else {
        setAutenticado(false);
      }
      setCarregandoInicial(false);
    };

    verificarAutenticacao();
  }, []);

  const lidarComLogout = async () => {
    await removerToken();
    delete api.defaults.headers.common["Authorization"];
    setAutenticado(false);
    setUsuarioAdmin(false);
  };

  if (carregandoInicial) {
    return (
      <View style={estilos.containerCentral}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <CarrinhoProvider>
      <NavigationContainer>
        <Pilha.Navigator screenOptions={{ headerShown: false }}>
          {autenticado ? (
            <Pilha.Group>
              <Pilha.Screen
                name="Produtos"
                options={{ title: "Lista de Produtos" }}
              >
                {(props) => (
                  <TelaProdutos
                    {...props}
                    aoLogout={lidarComLogout}
                    usuarioAdmin={usuarioAdmin}
                  />
                )}
              </Pilha.Screen>
              <Pilha.Screen
                name="DetalhesProduto"
                options={{ title: "Detalhes do Produto" }}
                component={TelaDetalhesProduto}
              />
              <Pilha.Screen
                name="BuscarProdutos"
                options={{ title: "Buscar Produtos" }}
                component={TelaBuscaProdutos}
              />
              <Pilha.Screen
                name="AdminProdutos"
                options={{ title: "Gerenciar Produtos" }}
                component={TelaAdminProdutos}
              />
              <Pilha.Screen
                name="AdicionarProduto"
                options={{ title: "Novo Produto" }}
                component={TelaFormularioProduto}
              />
              <Pilha.Screen
                name="EditarProduto"
                options={{ title: "Editar Produto" }}
                component={TelaFormularioProduto}
              />
              <Pilha.Screen
                name="Carrinho"
                options={{ title: "Carrinho de Compras" }}
                component={TelaCarrinho}
              />
            </Pilha.Group>
          ) : (
            <Pilha.Group>
              <Pilha.Screen name="Login" options={{ title: "Entrar" }}>
                {(props) => (
                  <TelaLogin
                    {...props}
                    aoLoginSucesso={() => {
                      setAutenticado(true);
                      setUsuarioAdmin(true);
                    }}
                  />
                )}
              </Pilha.Screen>
            </Pilha.Group>
          )}
        </Pilha.Navigator>
        <Toast />
      </NavigationContainer>
    </CarrinhoProvider>
  );
}

const estilos = StyleSheet.create({
  containerCentral: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});