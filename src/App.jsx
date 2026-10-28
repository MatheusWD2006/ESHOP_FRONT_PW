import 'bootstrap/dist/css/bootstrap.min.css';
import '@popperjs/core/dist/cjs/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';

import Home from './componentes/view/Home';
import Sobre from './componentes/view/Sobre';

import Categoria from './components/view/categoria/Categoria';
import Produto from './components/view/produto/Produto';
import Login from './components/view/login/Login';

import MenuPublico from './components/MenuPublico';
import MenuPrivado from './components/MenuPrivado';

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