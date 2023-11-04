import React from "react";

function InfoSign({ values }) {
  const { changeStyleContainer } = values;

  return (
    <div className="overlay-container">
      <div className="overlay">
        <div className="overlay-panel overlay-left">
          <h1>¡Bienvenido!</h1>
          <p>
            Para mantenerse conectado con nosotros, inicie sesión con su
            información personal
          </p>
          <button className="ghost" id="signIn" onClick={changeStyleContainer}>
            Iniciar sesión
          </button>
        </div>
        <div className="overlay-panel overlay-right">
          <h1>Hola!</h1>
          <p>Ingresa tus datos y comienza tu recorrido con nosotros</p>
          <button className="ghost" id="signUp" onClick={changeStyleContainer}>
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoSign;
