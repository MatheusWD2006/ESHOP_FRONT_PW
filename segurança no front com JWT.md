# Segurança no Frontend com JWT

## 1. Bibliotecas adicionais para a segurança

Instale a biblioteca `jwt-decode` utilizando o seguinte comando no terminal:

```bash
yarn add jwt-decode
```

A biblioteca `jwt-decode` permite decodificar um token JWT para acessar suas informações, como os dados do usuário e a data de expiração.

---

## 2. Componente `Login.jsx`

Crie o componente `Login.jsx` no seguinte caminho:

**Caminho:** `/src/componentes/telas/login/Login.jsx`

Inicialmente, o componente pode ser criado com a seguinte estrutura:

```jsx
function Login() {
    return (
        <div>
            <h1>Tela de login</h1>
        </div>
    );
}

export default Login;
```

### Adicionando a rota de login no `App.jsx`

Adicione a seguinte configuração à lista de rotas do `App.jsx`:

```jsx
{
    path: "login",
    element: <Login />
}
```

Essa configuração permite acessar a tela de login pela rota `/login`.

---

## 3. Arquivo `Autenticacao.jsx`

O arquivo `Autenticacao.jsx` contém funções para obter o token, extrair os dados do usuário, armazenar as informações de autenticação no `localStorage` do navegador e realizar o logout.

Crie o arquivo no seguinte caminho:

**Caminho:** `/src/seguranca/Autenticacao.jsx`

```jsx
import { jwtDecode } from "jwt-decode";

const NOMEAPP = 'eshoppw';

export const getToken = () => {
    const localStorageAutenticacao =
        localStorage.getItem(NOMEAPP + '/autenticacao');

    const autenticacao = localStorageAutenticacao
        ? JSON.parse(localStorageAutenticacao)
        : null;

    if (autenticacao === null) {
        return null;
    }

    if (autenticacao.auth === false) {
        return null;
    } else {
        let decoded = jwtDecode(autenticacao.token);

        if (decoded.exp <= Math.floor(new Date() / 1000)) {
            console.log('Token expirado');
            logout();
            throw "Token expirado";
        } else {
            return autenticacao.token;
        }
    }
};

export const getUsuario = () => {
    const localStorageAutenticacao =
        localStorage.getItem(NOMEAPP + '/autenticacao');

    const autenticacao = localStorageAutenticacao
        ? JSON.parse(localStorageAutenticacao)
        : null;

    if (autenticacao === null) {
        return null;
    }

    if (autenticacao.auth === false) {
        return null;
    } else {
        let decoded = jwtDecode(autenticacao.token);

        if (decoded.exp <= Math.floor(new Date() / 1000)) {
            console.log('Token expirado');
            logout();
            throw "Token expirado";
        } else {
            return decoded.usuario;
        }
    }
};

export const gravaAutenticacao = (json) => {
    localStorage.setItem(
        NOMEAPP + '/autenticacao',
        JSON.stringify(json)
    );
};

export const logout = () => {
    localStorage.setItem(
        NOMEAPP + '/autenticacao',
        JSON.stringify({
            "auth": false,
            "token": ''
        })
    );
};
```

### Funções disponíveis

- `getToken()`: recupera o token armazenado e verifica se ele está expirado.
- `getUsuario()`: recupera os dados do usuário contidos no token.
- `gravaAutenticacao(json)`: armazena as informações de autenticação no `localStorage`.
- `logout()`: altera os dados armazenados para indicar que o usuário não está autenticado.

A data de expiração do token é comparada com o horário atual em segundos. Caso o token esteja expirado, a função realiza o logout e lança um erro.

---

## 4. Arquivo `WithAuth.jsx`

O arquivo `WithAuth.jsx` verifica a existência de um token válido antes de permitir a renderização de componentes que precisam de autenticação.

Crie o arquivo no seguinte caminho:

**Caminho:** `/src/seguranca/WithAuth.jsx`

```jsx
import { Navigate } from "react-router-dom";
import { getToken } from "./Autenticacao";

const WithAuth = (Component) => {

    const AuthRoute = () => {
        const isAuth = getToken() ? true : false;

        if (isAuth) {
            return <Component />;
        } else {
            return <Navigate to="/login" />;
        }
    };

    return AuthRoute;
};

export default WithAuth;
```

### Utilizando o `WithAuth`

Nos componentes que deverão ser protegidos, importe o `WithAuth` e utilize-o na exportação do componente.

Exemplo:

```jsx
// Importação
import WithAuth from "../../../seguranca/WithAuth";

// Exportação do componente protegido
export default WithAuth(Produto);
```

Nesse exemplo, o componente `Produto` somente será renderizado se a verificação do token permitir o acesso. Caso contrário, o usuário será redirecionado para `/login`.

---

## 5. Implementação da tela de login

Atualize o componente `Login.jsx` para implementar o formulário de autenticação.

**Caminho:** `/src/componentes/telas/login/Login.jsx`

```jsx
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import {
    gravaAutenticacao,
    getToken
} from '../../../seguranca/Autenticacao';

import Carregando from '../../comuns/Carregando';
import Alerta from '../../comuns/Alerta';
import CampoEntrada from '../../comuns/CampoEntrada';

function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const [alerta, setAlerta] = useState({
        status: "",
        message: ""
    });

    const [autenticado, setAutenticado] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const acaoLogin = async e => {

        e.preventDefault();

        try {
            const body = {
                email: email,
                senha: senha
            };

            setCarregando(true);

            await fetch(
                `${process.env.REACT_APP_ENDERECO_API}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            )
                .then(response => response.json())
                .then(json => {
                    if (json.auth === false) {
                        setAlerta({
                            status: "error",
                            message: json.message
                        });
                    }

                    if (json.auth === true) {
                        setAutenticado(true);
                        gravaAutenticacao(json);
                    }
                });

        } catch (err) {
            console.error(err.message);

            setAlerta({
                status: "error",
                message: err.message
            });
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        try {
            const token = getToken();

            if (token != null) {
                setAutenticado(true);
            }
        } catch (err) {
            setAlerta({
                status: "error",
                message: err != null ? err.message : ""
            });
        }
    }, []);

    if (autenticado === true) {
        return <Navigate to="/privado" />;
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    <Carregando carregando={carregando}>
                        <Alerta alerta={alerta} />

                        <form onSubmit={acaoLogin}>
                            <h1 className="h3 mb-3 fw-normal">
                                Login de usuário
                            </h1>

                            <CampoEntrada
                                value={email}
                                id="txtEmail"
                                name="email"
                                label="Nome"
                                tipo="email"
                                onchange={e => setEmail(e.target.value)}
                                msgvalido="Email OK"
                                msginvalido="Informe o email"
                                requerido={true}
                                readonly={false}
                                maxCaracteres={40}
                            />

                            <CampoEntrada
                                value={senha}
                                id="txtSenha"
                                name="senha"
                                label="Senha"
                                tipo="password"
                                onchange={e => setSenha(e.target.value)}
                                msgvalido="Senha OK"
                                msginvalido="Informe a senha"
                                requerido={true}
                                readonly={false}
                                maxCaracteres={40}
                            />

                            <button
                                className="w-100 btn btn-lg btn-primary"
                                type="submit"
                            >
                                Efetuar login
                            </button>
                        </form>
                    </Carregando>
                </div>
            </div>
        </div>
    );
}

export default Login;
```

### Funcionamento do login

1. O usuário informa o e-mail e a senha.
2. O formulário envia as credenciais para a rota `/login` da API.
3. Se a autenticação for bem-sucedida, o token recebido é armazenado no `localStorage`.
4. O estado `autenticado` é atualizado, e o usuário é redirecionado para `/privado`.
5. Se ocorrer um erro de autenticação, a mensagem recebida é apresentada na tela.

O componente também verifica, ao ser carregado, se existe um token válido armazenado no navegador.

---

## 6. Criação do componente `MenuPublico.jsx`

A aplicação terá dois menus: um menu público, que permite acessar as páginas públicas e a tela de login, e um menu privado, exibido na área autenticada.

Crie o arquivo no seguinte caminho:

**Caminho:** `/src/componentes/MenuPublico.jsx`

```jsx
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { NavLink, Outlet } from 'react-router-dom';

function MenuPublico() {

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <NavLink
                        className="navbar-brand"
                        exact="true"
                        to="/"
                    >
                        eShop
                    </NavLink>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink
                                className="nav-link active"
                                exact="true"
                                to="/"
                            >
                                Home
                            </NavLink>

                            <NavLink
                                className="nav-link active"
                                exact="true"
                                to="/sobre"
                            >
                                Sobre...
                            </NavLink>
                        </Nav>
                    </Navbar.Collapse>

                    <Navbar.Collapse className="justify-content-end">
                        <NavLink
                            className="nav-link active"
                            exact="true"
                            to="/login"
                        >
                            Login
                        </NavLink>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Outlet />
        </>
    );
}

export default MenuPublico;
```

O `MenuPublico` apresenta os links para a página inicial, a página Sobre e a tela de login. O componente `Outlet` permite renderizar as páginas filhas definidas nas rotas.

---

## 7. Criação do componente `MenuPrivado.jsx`

O componente `MenuPrivado` pode ser baseado no componente `Menu.jsx` existente, ajustando as rotas para a área privada e incluindo informações do usuário autenticado.

Crie o arquivo no seguinte caminho:

**Caminho:** `/src/componentes/MenuPrivado.jsx`

```jsx
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { NavLink, Outlet } from 'react-router-dom';

import {
    getUsuario,
    logout
} from '../seguranca/Autenticacao';

function MenuPrivado() {

    const usuario = getUsuario();

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <NavLink
                        className="navbar-brand"
                        exact="true"
                        to="/privado"
                    >
                        eShop
                    </NavLink>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink
                                className="nav-link active"
                                exact="true"
                                to="/privado"
                            >
                                Home
                            </NavLink>

                            {usuario &&
                                <NavDropdown
                                    title="Manutenções"
                                    id="basic-nav-dropdown"
                                >
                                    <NavLink
                                        className="dropdown-item"
                                        exact="true"
                                        to="categorias"
                                    >
                                        Categorias
                                    </NavLink>

                                    <NavLink
                                        className="dropdown-item"
                                        exact="true"
                                        to="produtos"
                                    >
                                        Produtos
                                    </NavLink>
                                </NavDropdown>
                            }

                            <NavLink
                                className="nav-link active"
                                exact="true"
                                to="sobre"
                            >
                                Sobre...
                            </NavLink>
                        </Nav>
                    </Navbar.Collapse>

                    <Navbar.Collapse className="justify-content-end">
                        <NavDropdown
                            title={
                                usuario
                                    ? "Usuário: " + usuario.nome
                                    : "Usuário"
                            }
                            id="basic-nav-dropdown"
                        >
                            {usuario ?
                                <NavLink
                                    className="dropdown-item"
                                    exact="true"
                                    to="/"
                                    onClick={() => logout()}
                                >
                                    Logout
                                </NavLink>
                                :
                                <NavLink
                                    className="dropdown-item"
                                    exact="true"
                                    to="/login"
                                >
                                    login
                                </NavLink>
                            }
                        </NavDropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Outlet />
        </>
    );
}

export default MenuPrivado;
```

### Funcionamento do menu privado

- O nome do usuário é obtido por meio da função `getUsuario()`.
- O menu apresenta opções para acessar as categorias e os produtos.
- A opção de logout chama a função `logout()`, alterando os dados de autenticação armazenados.
- O `Outlet` renderiza os componentes correspondentes às rotas filhas.

---

## 8. Modificação do arquivo `App.jsx`

Modifique o componente `App.jsx` para registrar as rotas públicas e privadas, utilizando os menus correspondentes.

**Caminho:** `/src/App.jsx`

```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import '@popperjs/core/dist/cjs/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';

import Home from './componentes/telas/Home';
import Sobre from './componentes/telas/Sobre';

import Categoria from './componentes/telas/categoria/Categoria';
import Produto from './componentes/telas/produto/Produto';
import Login from './componentes/telas/login/Login';

import MenuPublico from './componentes/MenuPublico';
import MenuPrivado from './componentes/MenuPrivado';

const router = createBrowserRouter([
    {
        path: "/",
        element: <MenuPublico />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/sobre",
                element: <Sobre />
            },
            {
                path: "login",
                element: <Login />
            }
        ]
    },
    {
        path: "/privado",
        element: <MenuPrivado />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "sobre",
                element: <Sobre />
            },
            {
                path: "categorias",
                element: <Categoria />
            },
            {
                path: "produtos",
                element: <Produto />
            }
        ]
    }
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
```

### Organização das rotas

| Caminho | Componente | Área |
|---|---|---|
| `/` | `Home` | Pública |
| `/sobre` | `Sobre` | Pública |
| `/login` | `Login` | Pública |
| `/privado` | `Home` | Privada |
| `/privado/sobre` | `Sobre` | Privada |
| `/privado/categorias` | `Categoria` | Privada |
| `/privado/produtos` | `Produto` | Privada |

O `MenuPublico` e o `MenuPrivado` funcionam como estruturas para suas respectivas rotas filhas. Assim, cada área apresenta seu próprio menu.

---

## 9. Ajustes nos componentes que chamam os serviços

Nos componentes responsáveis pelas requisições à API, é necessário enviar o token JWT no cabeçalho HTTP `Authorization`.

Exemplo de implementação de um serviço para recuperar as categorias:

```jsx
import { getToken } from '../seguranca/Autenticacao';

export const getCategoriaServico = async () => {
    const response = await fetch(
        `${process.env.REACT_APP_ENDERECO_API}/categoria`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": getToken()
            }
        }
    );

    const data = await response.json();

    return data;
};
```

A função `getToken()` recupera o token armazenado no navegador. O token é enviado no cabeçalho da requisição para que a API possa verificar se o acesso está autorizado.

### Código-fonte completo do serviço de produtos

Crie ou atualize o arquivo abaixo:

**Caminho:** `/src/componentes/servicos/ProdutoServico.jsx`

```jsx
import { getToken } from '../seguranca/Autenticacao';

export const getProdutosAPI = async () => {
    const response = await fetch(
        `${process.env.REACT_APP_ENDERECO_API}/produto`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": getToken()
            }
        }
    );

    const data = await response.json();

    return data;
};

export const getProdutoPorCodigoAPI = async codigo => {
    const response = await fetch(
        `${process.env.REACT_APP_ENDERECO_API}/produto/${codigo}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": getToken()
            }
        }
    );

    const data = await response.json();

    return data;
};

export const deleteProdutoPorCodigoAPI = async codigo => {
    const response = await fetch(
        `${process.env.REACT_APP_ENDERECO_API}/produto/${codigo}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authorization": getToken()
            }
        }
    );

    const data = await response.json();

    return data;
};

export const cadastraProdutoAPI = async (objeto, metodo) => {
    const response = await fetch(
        `${process.env.REACT_APP_ENDERECO_API}/produto/`,
        {
            method: metodo,
            headers: {
                "Content-Type": "application/json",
                "authorization": getToken()
            },
            body: JSON.stringify(objeto)
        }
    );

    const data = await response.json();

    return data;
};
```

As funções disponibilizadas pelo arquivo são:

- `getProdutosAPI()`: recupera a lista de produtos.
- `getProdutoPorCodigoAPI(codigo)`: recupera um produto específico.
- `deleteProdutoPorCodigoAPI(codigo)`: solicita a exclusão de um produto.
- `cadastraProdutoAPI(objeto, metodo)`: cadastra ou atualiza um produto, de acordo com o método HTTP informado.

Todas as requisições incluem o token JWT no cabeçalho `Authorization`.

---

## 10. Tratamento de erros nos componentes que realizam requisições

Nos componentes que chamam os serviços, é necessário tratar erros que possam ocorrer durante as requisições. Um exemplo é quando o token expira e a API deixa de autorizar o acesso.

Nesses casos, o componente pode redirecionar o usuário para a tela de login utilizando o `useNavigate` do React Router.

### Importação e configuração

No componente que realiza as requisições, importe o `useNavigate`:

```jsx
import { useNavigate } from "react-router-dom";
```

Dentro do componente, inicialize a função de navegação:

```jsx
function Categoria() {

    let navigate = useNavigate();

    // Demais estados e funções do componente...
}
```

### 10.1. Edição de um objeto

```jsx
const editarObjeto = async codigo => {
    try {
        setObjeto(await getCategoriaPorCodigoAPI(codigo));
        setEditar(true);
        setAlerta({
            status: "",
            message: ""
        });
        setExibirForm(true);

    } catch (err) {
        // Redireciona para a tela de login em caso de erro
        navigate("/login", { replace: true });
    }
};
```

### 10.2. Cadastro ou atualização de um objeto

```jsx
const acaoCadastrar = async e => {
    e.preventDefault();

    const metodo = editar ? "PUT" : "POST";

    try {
        let retornoAPI = await cadastraCategoriaAPI(objeto, metodo);

        setAlerta({
            status: retornoAPI.status,
            message: retornoAPI.message
        });

        setObjeto(retornoAPI.objeto);

        if (!editar) {
            setEditar(true);
        }

    } catch (err) {
        console.log("Erro: " + err);

        // Redireciona para a tela de login em caso de erro
        navigate("/login", { replace: true });
    }

    recuperaCategorias();
};
```

### 10.3. Recuperação da lista de categorias

```jsx
const recuperaCategorias = async () => {
    try {
        setCarregando(true);

        setListaObjetos(await getCategoriasAPI());

        setCarregando(false);

    } catch (err) {
        // Redireciona para a tela de login em caso de erro
        navigate("/login", { replace: true });
    }
};
```

### 10.4. Remoção de um objeto

```jsx
const remover = async codigo => {
    if (window.confirm('Deseja remover este objeto?')) {
        try {
            let retornoAPI = await deleteCategoriaPorCodigoAPI(codigo);

            setAlerta({
                status: retornoAPI.status,
                message: retornoAPI.message
            });

            recuperaCategorias();

        } catch (err) {
            // Redireciona para a tela de login em caso de erro
            navigate("/login", { replace: true });
        }
    }
};
```

### Funcionamento do tratamento de erros

Os blocos `try...catch` permitem tratar erros que ocorram durante a execução das requisições.

Quando uma operação falha, o bloco `catch` pode redirecionar o usuário para a tela de login. A opção `replace: true` substitui a entrada atual no histórico de navegação, evitando que o usuário retorne à página anterior simplesmente utilizando o botão Voltar.

---

## 11. Resumo do funcionamento da segurança no frontend

O processo de autenticação e proteção do frontend pode ser resumido nas seguintes etapas:

1. O usuário acessa a tela de login e informa suas credenciais.
2. O frontend envia os dados para a rota `/login` da API.
3. A API valida as credenciais e retorna um token JWT.
4. O frontend armazena os dados de autenticação no `localStorage`.
5. A função `getToken()` recupera o token e verifica sua data de expiração.
6. O componente `WithAuth` verifica se há um token válido antes de renderizar os componentes protegidos.
7. Os serviços enviam o token JWT no cabeçalho `Authorization` das requisições.
8. A API verifica o token antes de permitir o acesso às rotas protegidas.
9. Quando ocorre um erro, o frontend pode redirecionar o usuário para a tela de login.
10. Ao realizar logout, os dados de autenticação são atualizados no `localStorage`.

**Importante:** a proteção implementada no frontend melhora o controle de navegação, mas não substitui a verificação de segurança no backend. A API deve continuar validando o JWT em todas as rotas protegidas.

