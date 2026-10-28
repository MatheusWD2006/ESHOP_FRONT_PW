# eShop Frontend

Aplicação web desenvolvida como parte de um trabalho acadêmico da disciplina **Programação Web**. O frontend do eShop oferece uma interface para consultar e manter categorias e produtos, consumindo uma API REST em um projeto separado.

> Este projeto tem finalidade didática e não deve ser considerado pronto para uso em produção sem revisões e ajustes.

## Tecnologias

- **React** para construir a interface;
- **React Router** para navegação entre páginas;
- **React Bootstrap**, **Bootstrap** e **Bootstrap Icons** para componentes e ícones;
- **Fetch API** para comunicação com o backend.

## Funcionalidades

- Página inicial e página “Sobre”;
- Listagem, criação, edição e remoção de categorias;
- Listagem, criação, edição e remoção de produtos;
- Seleção de categoria no formulário de produto;
- Exibição de informações dos produtos, incluindo estoque, situação, valor e data de cadastro.

## Organização do projeto

- `src/App.jsx`: define as rotas da aplicação;
- `src/components/Menu.jsx`: menu de navegação e layout compartilhado;
- `src/components/view/`: páginas e telas de categorias, produtos, início e informações;
- `src/components/common/`: componentes reutilizáveis, como campos, alertas, diálogos e indicador de carregamento;
- `src/services/`: funções que fazem as chamadas HTTP para a API;
- `public/`: documento HTML inicial da aplicação.

As telas de categorias e produtos organizam o estado e as operações em componentes de página e contextos. Os serviços encapsulam as chamadas ao backend.

## Requisitos

- Node.js e npm ou Yarn;
- A API do eShop em execução e acessível pelo navegador.

## Como executar localmente

1. Instale as dependências:

   ```bash
   npm install
   ```

   Ou, se preferir usar Yarn:

   ```bash
   yarn install
   ```

2. Configure o endereço base da API em um arquivo `.env` na raiz do frontend:

   ```env
   REACT_APP_ENDERECO_API=http://localhost:3003
   ```

   Substitua o endereço caso a API esteja em outra máquina ou porta. Essa variável é incorporada durante a execução/build do Create React App; reinicie o servidor de desenvolvimento depois de alterá-la.

3. Inicie a aplicação:

   ```bash
   npm start
   ```

   Ou:

   ```bash
   yarn start
   ```

O Create React App normalmente abre a aplicação em `http://localhost:3000`.

## Integração com a API

O frontend usa os seguintes caminhos:

| Recurso | Operações utilizadas |
| --- | --- |
| Categorias | `GET`, `POST`, `PUT` em `/categoria`; `GET` e `DELETE` em `/categoria/:codigo` |
| Produtos | `GET`, `POST`, `PUT` em `/produto`; `GET` e `DELETE` em `/produto/:codigo` |

As chamadas de categorias têm como endereço padrão `http://localhost:3003` quando `REACT_APP_ENDERECO_API` não está definida. As chamadas de produtos usam diretamente `REACT_APP_ENDERECO_API`; portanto, configure essa variável para usar as telas de produto.

### Observação sobre autenticação de produtos

A API do projeto protege as rotas de produtos com JWT. Na versão atual, os serviços do frontend não fazem login nem enviam o token no cabeçalho `Authorization`. Assim, as operações de produto podem receber resposta `401` enquanto essa integração não for implementada; configurar apenas o endereço da API não substitui a autenticação. As rotas de categoria não exigem token.

## Scripts disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm test` | Executa os testes configurados pelo Create React App |
| `npm run build` | Gera a versão otimizada para publicação na pasta `build/` |
| `npm run eject` | Expõe a configuração interna do Create React App; é uma operação de mão única |

Os mesmos scripts podem ser executados com `yarn`, por exemplo `yarn build`.