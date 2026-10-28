import { Navigate } from "react-router-dom";
import { getToken } from "./Autenticacao";

const WithAuth = (Component) => {

    const AuthRoute = () => {
        let isAuth = false;

        try {
            isAuth = Boolean(getToken());
        } catch (err) {
            console.error("Erro ao validar autenticação:", err);
        }

        return isAuth ? <Component /> : <Navigate to="/login" replace />;
    };

    return AuthRoute;
};

export default WithAuth;