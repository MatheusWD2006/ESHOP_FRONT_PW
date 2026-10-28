import { useState, useEffect } from "react";
import CategoriaContext from "./CategoriaContext";
import {
  getCategoriasAPI,
  getCategoriaPorCodigoAPI,
  deleteCategoriaPorCodigoAPI,
  cadastraCategoriaAPI,
} from "../../../services/CategoriaServico";
import Tabela from "./Tabela";
import Formulario from "./Formulario";
import Carregando from "../../common/Carregando";
import { useNavigate } from "react-router-dom";

function Categoria() {
  let navigate = useNavigate();
  const [alerta, setAlerta] = useState({ status: "", message: "" });
  const [listaObjetos, setListaObjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);

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

  const remover = async (codigo) => {
    if (window.confirm("Deseja remover este objeto?")) {
      try {
        let retornoAPI = await deleteCategoriaPorCodigoAPI(codigo);

        setAlerta({
          status: retornoAPI.status,
          message: retornoAPI.message,
        });

        recuperaCategorias();
      } catch (err) {
        // Redireciona para a tela de login em caso de erro
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    recuperaCategorias();
  }, []);

  // Novos estados e métodos
  const [editar, setEditar] = useState(false);
  const [exibirForm, setExibirForm] = useState(false);

  const [objeto, setObjeto] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    sigla: "",
  });

  const novoObjeto = () => {
    setEditar(false);
    setAlerta({ status: "", message: "" });
    setObjeto({
      codigo: 0,
      nome: "",
    });
    setExibirForm(true);
  };

  const editarObjeto = async (codigo) => {
    try {
      setObjeto(await getCategoriaPorCodigoAPI(codigo));
      setEditar(true);
      setAlerta({
        status: "",
        message: "",
      });
      setExibirForm(true);
    } catch (err) {
      // Redireciona para a tela de login em caso de erro
      navigate("/login", { replace: true });
    }
  };

  const acaoCadastrar = async (e) => {
    e.preventDefault();

    const metodo = editar ? "PUT" : "POST";

    try {
      let retornoAPI = await cadastraCategoriaAPI(objeto, metodo);

      setAlerta({
        status: retornoAPI.status,
        message: retornoAPI.message,
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
  // Adicionando no value do Provider os novos estados e métodos
  // para uso dos componentes filhos
  return (
    <CategoriaContext.Provider
      value={{
        listaObjetos,
        alerta,
        remover,
        objeto,
        editarObjeto,
        acaoCadastrar,
        handleChange,
        novoObjeto,
        exibirForm,
        setExibirForm,
      }}
    >
      <Carregando carregando={carregando}>
        <Tabela />
      </Carregando>
      <Formulario />
    </CategoriaContext.Provider>
  );
}

export default Categoria;
