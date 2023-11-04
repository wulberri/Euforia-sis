import { createContext, useContext, useEffect, useState } from "react";
import { getNewAccessTokenRequest, getUserInfoRequest } from "../api/usuarios.api";
import Loader from "../components/Loader";

const ContextUser = createContext(); //Se crea el contexto

//Funcion para facilitar la importación en los componentes que van a utilizar el contexto
export const useContextUser = () => {
  const context = useContext(ContextUser);
  //Validar que si haya un contexto
  if (context === undefined) {
    throw new Error("useContextUser debe usarse dentro de un UserContext");
  }
  return context;
};

function UserContext({ children }) {
  //Estado para saber si un usuario esta autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [accessToken, setAccessToken] = useState(""); //AccessToken del usuario autenticado
  const [user, setUser] = useState({}); //Información del usuario autenticado
  const [isLoading, setIsLoading] = useState(false); //Saber si hay una carga al obtener el hijo del contexto

  useEffect(() => {
    checkAuth();
  }, []);

  //Esta función permite asignar los valores del estado
  const checkAuth = async () => {
    if (accessToken) {
      console.log("ENTRA EN EL PRIMER IF (prueba ya que nunca entra)");
      console.log("NO LO HE ELIMINADO POR SI ACASO");
      //Si el usuario ya esta autenticado
      //Hace una petición al servidor para obtener los datos del usuario que esta autenticado
      // const userInfo = await getUserInfoRequest(accessToken); 
      // //Guarda el usuario con sus tokens
      // saveUser({
      //   user: userInfo,
      //   accessToken: accessToken,
      //   refreshToken: getAccessToken(),
      // });
    } else {
      //Si el usuario se autentico pero caduco el token
      //Lo que se va a hacer es refrescar el token
      //Obtenemos el que ya esta en el localstorage (que fue el que caduco)
      const r_token = getRefreshToken(); 
      if (r_token) {
        //Generamos un nuevo token a partir de la peticion al servidor con el refreshToken caducado
        const response = await getNewAccessTokenRequest(r_token);
        //Hace una petición al servidor con el nuevo accessToken para obtener 
        //los datos del usuario que ya estaba autenticado
        const userInfo = await getUserInfoRequest(response.accessToken);
        //Guarda el usuario con sus tokens
        saveUser({
          user: userInfo,
          accessToken: response.accessToken,
          refreshToken: r_token,
        });
      }
    }
    setIsLoading(false); //Asignamos el estado de carga a falso
  };

  //Getters
  const getAccessToken = () => accessToken; 
  const getRefreshToken = () => localStorage.getItem("token") || null;
  const getUser = () => user;

  //Guardar la información del usuario y para marcar la autenticación
  const saveUser = (responseToBack) => {
    setAccessToken(responseToBack.accessToken); //Guarda la información del accessToken
    //Lo que esta adentro del setUser es para no guardar las propiedades el iat y exp generados por jwt
    setUser((({ iat, exp, ...rest }) => rest)(responseToBack.user)); //Guardar la información de el usuario
    //Indicar un item en el localStorage, esto para indicar que estamos autenticados de forma general
    localStorage.setItem("token", responseToBack.refreshToken); 
    setIsAuthenticated(true);  //Marcar que ya estamos autenticados
  };

  //Cerrar sesión
  const signout = () => {
    setIsAuthenticated(false); //Marcar que ya no estamos autenticados
    setAccessToken("");  //Eliminamos el accessToken porque ya no hay usuario autenticad
    setUser(undefined); //Ya no deberia haber un usuario, por lo tanto se marca como undefined
    localStorage.removeItem("token"); //Elimina el item que estaba en el localStorage
  };

  return (
    <ContextUser.Provider
      value={{
        isAuthenticated,
        getAccessToken,
        getRefreshToken,
        saveUser,
        getUser,
        signout
      }}
    >
      {isLoading ? <Loader/> : children}
    </ContextUser.Provider>
  );
}

export default UserContext;
