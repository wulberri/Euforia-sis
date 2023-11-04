import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { getAllUsersRequest } from "../api/usuarios.api";
import { useContextUser } from "../context/UserContext";
import { updateUserRequest } from "../api/usuarios.api";
import "./usuarios.css";

function Usuarios() {
  //Uso del contexto
  const { getAccessToken } = useContextUser();

  //Estado para almacenar los usuarios obtenidos en respuesta al servidor
  const [usuarios, setUsuarios] = useState([]);

  //Función para hacer la petición al servidor de obtener todos los usuarios
  useEffect(() => {
    return async () => {
      const response = await getAllUsersRequest(getAccessToken());
      setUsuarios(response);
    };
  }, []);

  // Función para manejar cambios en los checkboxes al hacer clic
  const handleCheckboxChange = async (e, index) => {
    //Accede al usuario correspondiente en el array 'usuarios' según el índice proporcionado
    //Actualiza el rol del usuario en el estado local
    usuarios[index].rol = e.target.checked ? "administrador" : "usuario";
    setUsuarios([...usuarios]); //Actualiza el estado de usuarios
    //Se realiza una solicitud al servidor para actualizar el usuario en la base de datos
    await updateUserRequest(getAccessToken(), usuarios[index]); 
  };

  return (
    <>
      <NavBar />

      <div className="usuarios">
        <h1>Usuarios</h1>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={index}>
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckboxChange(e, index)}
                    checked={usuario.rol === "administrador"}
                    // disabled={usuario.rol === "administrador"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Usuarios;
