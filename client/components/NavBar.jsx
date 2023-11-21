import "./navbar.css";
import { useContextUser } from "../context/UserContext";
import { signoutRequest } from "../api/usuarios.api";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  //Usamos el contexto de la app
  const { getUser, signout, getRefreshToken } = useContextUser();

  const navigate = useNavigate();

  //Función para cuando el usuario cierre sesión (clic)
  const handleSignOut = () => {
    const token = getRefreshToken(); //Obtiene el token del localStorage
    signoutRequest(token); //Envia la petición al servidor para eliminar el token de la BD
    signout(); //Función utilizada del contexto
  };

  return (
    <div className="navbar">
      <div className="info-user">
        <img
          className="user-avatar"
          src={
            getUser().rol === "administrador"
              ? "https://cdn-icons-png.flaticon.com/512/147/147140.png"
              : "https://cdn-icons-png.flaticon.com/512/147/147131.png"
          }
          alt="Imagen de Usuario por Defecto"
        />

        <p className="user-name">
          {getUser().nombre.charAt(0).toUpperCase() + getUser().nombre.slice(1)}
        </p>
      </div>

      <div className="nav-content">
        {getUser().rol === "usuario" ? (
          <Link to="/recursos">Recursos</Link>
        ):(
          <Link to="/adrecursos">Recursos</Link>
        )}
        {getUser().rol === "usuario" ? (
          <Link to="/reservas">Reservas</Link>
        ):(
          <Link to="/adreservas">Reservas</Link>
        )}
        {getUser().rol === "administrador" && (
          <Link to="/prestamos">Prestamos</Link>
        )}
        {getUser().rol === "administrador" && <Link to="/usuarios">Users</Link>}
        <button onClick={handleSignOut} className="logout-link">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default NavBar;
