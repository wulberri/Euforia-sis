import "./notfound.css";
import { Link } from "react-router-dom";

//Componente para página no encontrada
function NotFound() {
  return (
    <div className="notfound">
      <h1 className="h1-nf">404</h1>
      <p className="p-nf">¡Ups! Página no encontrada.</p>
      <span className="s-nf">
        Los sentimos, La página que esta buscando no fue encontrada.
      </span>
      <Link to="/">
        <button className="btt-nf">Volver</button>
      </Link>
    </div>
  );
}

export default NotFound;
