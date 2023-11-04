import { Outlet, Navigate } from "react-router-dom";
import { useContextUser } from "../context/UserContext";

function ProtectedRoute() {
  //Uso del contexto del usuario
  const { getUser } = useContextUser();

  //Primero se comprueba si hay realmente un usuario
  //Para poder acceder a la propiedad rol, comprobando que tenga rol de administrador
  return getUser() && getUser().rol === "administrador" ? (
    <Outlet /> //Si si, se muestra el componente hijo
  ) : (
    <Navigate to="/" /> //Sino, lo redirige a la raiz
  );
}

export default ProtectedRoute;
