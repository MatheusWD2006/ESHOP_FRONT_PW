import { useContext } from 'react';

import Alerta from '../../common/Alerta';
import CategoriaContext from './CategoriaContext';

import Col from 'react-bootstrap/Col';

import CampoEntrada from '../../common/CampoEntrada';
import Dialogo from '../../common/Dialogo';

function Formulario() {

    const {
        objeto,
        handleChange,
        acaoCadastrar,
        alerta,
        exibirForm,
        setExibirForm
    } = useContext(CategoriaContext);

    return (
        <Dialogo
            id="modalEdicao"
            titulo="Categoria"
            idform="formulario"
            acaoCadastrar={acaoCadastrar}
            exibirForm={exibirForm}
            setExibirForm={setExibirForm}
        >

            <Alerta alerta={alerta} />

            <Col xs={12} md={12}>
                <CampoEntrada
                    value={objeto.codigo}
                    id="txtCodigo"
                    name="codigo"
                    label="Código"
                    tipo="number"
                    onchange={handleChange}
                    readonly={true}
                    maxCaracteres={5}
                />
            </Col>

            <Col xs={12} md={12}>
                <CampoEntrada
                    value={objeto.nome}
                    id="txtNome"
                    name="nome"
                    label="Nome"
                    tipo="text"
                    onchange={handleChange}
                    msgvalido="OK certo"
                    msginvalido="Informe o nome"
                    requerido={true}
                    readonly={false}
                    maxCaracteres={40}
                />
            </Col>

        </Dialogo>
    )
}

export default Formulario;
