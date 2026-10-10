import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

import Menu from "./components/Menu";
import Home from "./components/view/Home";
import Categoria from "./components/view/categoria/Categoria";
import Produto from "./components/view/produto/Produto";
import Sobre from "./components/view/Sobre"; // 1. Importar o componente Sobre

const router = createBrowserRouter([
    {
        path: "/",
        element: <Menu />,

        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "categorias",
                element: <Categoria/>
            },
            {
                path: "produtos",
                element: <Produto/>
            },
            {
                path: "sobre", 
                element: <Sobre/>
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