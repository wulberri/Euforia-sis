import { useState } from "react";
import { signupRequest } from "../api/usuarios.api";

function FormSignUp({ values }) {
  //Estado para manejar los errores que me envia el backend
  const [errors, setErrors] = useState("");

  //Props para el manejo del contenedor o del formulario (animación que se mueve de un lado a otro)
  const { changeStyleContainer } = values; 

  //Estado incial del usuario
  const stateInitial = {
    nombre: "",
    correo: "",
    contrasena: "",
  };

  //Estado para el usuario a crear
  const [userToCreate, setUserToCreate] = useState(stateInitial);

  //Funcion para guardar los valores del formulario en un estado
  const handleChangeUserToCreate = ({ target: { name, value } }) => {
    //Obtengo la etiqueta con el nombre y el valor
    //Para poder cambiar el estado con lo que ya tenia (...userToCreate)
    //y lo que quiero añadir al campo [name] : con su valor 'value'
    setUserToCreate({ ...userToCreate, [name]: value });
    setErrors("");
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();
    try {
      await signupRequest(userToCreate); //Mandar la peticion al servidor para crear usuario
      setUserToCreate(stateInitial); //Limpian los campos del formulario
      changeStyleContainer("container"); //Mostrar la parte de iniciar sesión (ya que creo un usuario)
      setErrors(""); //Asigamos el estado de error a vacío
    } catch (error) {
      setErrors(error.response.data.error); //Asignamos el error del backend al estado
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmitSignUp}>
        <h1>Crear Cuenta</h1>
        <span>crear una cuenta de usuario</span>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={userToCreate.nombre}
          onChange={handleChangeUserToCreate}
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={userToCreate.correo}
          onChange={handleChangeUserToCreate}
        />
        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={userToCreate.contrasena}
          onChange={handleChangeUserToCreate}
        />
        {errors && <span className="error">{errors}</span>}
        <button>Crear Cuenta</button>
      </form>
    </div>
  );
}

export default FormSignUp;
