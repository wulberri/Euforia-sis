import { Outlet, Navigate } from "react-router-dom";
import { useContextUser } from "../context/UserContext";

function ProtectedRoute() {
  //Uso del contexto del usuario
  const {isAuthenticated} = useContextUser(); 

  //Si el usuario esta autenticado me muestra el componente hijo, sino lo redirige a la raiz
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;
