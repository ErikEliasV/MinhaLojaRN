# MinhaLojaRN: Aplicativo de Autenticação e Listagem de Produtos

Este é um projeto de exemplo em React Native que demonstra os conceitos fundamentais de autenticação de usuário e consumo de APIs protegidas com tokens. Ele simula um aplicativo de e-commerce básico onde os usuários podem fazer login e, em seguida, visualizar e pesquisar uma lista de produtos.

## Visão Geral do Projeto

O objetivo principal deste aplicativo é ilustrar um fluxo de autenticação comum em aplicações mobile:

1.  **Login de Usuário:** O usuário fornece credenciais em uma tela dedicada.
2.  **Obtenção e Armazenamento de Token:** Após um login bem-sucedido, um token de autenticação é recebido da API e armazenado localmente no dispositivo.
3.  **Acesso a Recursos Protegidos:** O token armazenado é automaticamente anexado a todas as requisições subsequentes para endpoints que exigem autenticação, permitindo o acesso a dados protegidos, como a lista de produtos.
4.  **Listagem e Busca de Produtos:** Uma tela dedicada exibe os produtos obtidos da API, com a funcionalidade de pesquisar e filtrar esses produtos.

Este projeto é ideal para estudantes e desenvolvedores que estão começando com React Native e desejam entender como integrar um backend RESTful com funcionalidades de autenticação.

## Funcionalidades Principais

  * **Tela de Login Funcional:** Interface para inserção de nome de usuário e senha.
  * **Autenticação com API:** Interação com o endpoint de login da Fake Store API.
  * **Gerenciamento de Token:** Armazenamento persistente do token de autenticação utilizando AsyncStorage.
  * **Requisições Autenticadas:** Configuração do Axios para incluir automaticamente o token em todas as chamadas à API para recursos protegidos.
  * **Listagem de Produtos:** Exibição de uma lista de produtos obtidos de uma API.
  * **Funcionalidade de Busca:** Filtro de produtos por termo de busca, aplicado na lista exibida.
  * **Feedback ao Usuário:** Indicadores de carregamento e mensagens de erro durante as operações da API.

## Tecnologias Utilizadas

  * **[React Native](https://reactnative.dev/):** Framework para construção de aplicações mobile nativas usando JavaScript/TypeScript.
  * **[TypeScript](https://www.typescriptlang.org/):** Superset do JavaScript que adiciona tipagem estática, melhorando a qualidade do código e a produtividade.
  * **[Expo](https://expo.dev/):** Plataforma para desenvolvimento rápido de aplicativos React Native, simplificando a configuração e o fluxo de trabalho.
  * **[Axios](https://www.google.com/search?q=https://axios-http.com/docs/):** Cliente HTTP baseado em Promises para o navegador e Node.js, utilizado para fazer requisições à API.
  * **[@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/):** Armazenamento de dados persistente, assíncrono e não criptografado para React Native.

## API Utilizada

Este projeto utiliza a **[Fake Store API](https://fakestoreapi.com/)** para simular um backend de e-commerce. A API fornece endpoints para autenticação de usuários e acesso a dados de produtos, carrinhos e usuários de forma mockada, ideal para fins de aprendizado e testes.

## Como Executar

Para configurar e executar este projeto em seu ambiente local:

1.  **Clone este repositório** (ou siga as instruções do guia passo a passo).
2.  **Instale as dependências** do projeto utilizando npm ou yarn.
3.  **Inicie o servidor de desenvolvimento** do Expo.
4.  **Use o aplicativo Expo Go** em seu dispositivo móvel ou um emulador/simulador para visualizar o aplicativo.
