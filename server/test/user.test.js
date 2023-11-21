import request from "supertest";
import app from "../server.js";

/*
Observaciones: 
1. userData debe ser un usuario no este en la BD
2. userSignin2 debe ser un usuario que no este en la BD
2. El idDelRecurso debe ser un recurso que si este en la BD
*/

//Credenciales de pruebas
const idDelRecurso = 4;
const userData = {
  nombre: "test",
  correo: "test@test.com",
  contrasena: "test",
};
const userSignin = {
  correo: "test@test.com",
  contrasena: "test",
};
const userSignin2 = {
  correo: "test1@test.com",
  contrasena: "test",
};
const userUpdate = {
  rol: "administrador",
  correo: "test@test.com",
};

describe("Registro de sesión", () => {
  it("debería crear un nuevo usuario", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(userData)
      .expect(201) // Se espera un código de respuesta 201 (creado)
      .end((err, res) => {
        if (err) return done(err);
        // Verifica que la respuesta incluya un mensaje de éxito
        expect(res.body.message).toBe("Usuario registrado exitosamente");
        // Limpieza: Eliminar el usuario creado si es necesario
        done();
      });
  });

  it("no deberia crear un usuario, ya existe el usuario", (done) => {
    request(app)
      .post("/api/user/signup")
      .send(userData)
      .expect(409)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

// Inicio de sesion
describe("Inicio de sesión", () => {
  it("deberia iniciar sesion con credenciales validas", (done) => {
    request(app)
      .post("/api/user/signin")
      .send(userSignin)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        //expect(res.body).toHaveProperty('accessToken');
        //expect(res.body).toHaveProperty('refreshToken');
        done();
      });
  });

  it("deberia no iniciar sesion con credenciales invalidas", (done) => {
    request(app)
      .post("/api/user/signin")
      .send(userSignin2)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("Obtener recursos (duración consulta)", () => {
  it("debería medir el tiempo de una consulta a la base de datos", (done) => {
    const startTime = process.hrtime();
    request(app)
      .get("/api/resources/all-resources")
      // .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxNSwibm9tYnJlIjoidGVzdCIsImNvcnJlbyI6InRlc3RAdGVzdC5jb20iLCJyb2wiOiJ1c3VhcmlvIiwiaWF0IjoxNzAwNTkxNTkyLCJleHAiOjE3MDA1OTUxOTJ9.fyqdNk61fT6to3tSBGnzRNeGP0k0OzBtJwTXRX_cwEQ')
      .expect(200) // Se espera un código de respuesta 200
      .end((err, res) => {
        if (err) return done(err);
        const endTime = process.hrtime(startTime);
        const queryTimeInMs = endTime[0] * 1000 + endTime[1] / 1000000;

        // Define un límite de tiempo
        const queryTimeLimit = 150; // Ajusta el límite de tiempo según tus necesidades

        if (queryTimeInMs > queryTimeLimit) {
          console.log(`La consulta getAllUsers tardó ${queryTimeInMs} ms`);
        }

        // Comprueba si el tiempo de consulta está dentro del límite
        expect(queryTimeInMs).toBeLessThanOrEqual(queryTimeLimit);

        done();
      });
  });
});

describe("Actualización de usuario", () => {
  it("deberia actualizar el rol de un usuario", (done) => {
    request(app)
      .put("/api/user/users/update")
      .send(userUpdate)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

// Eliminar un recurso
describe("Eliminación de recurso", () => {
  it("deberia eliminar un recurso existente", (done) => {
    const url = "/api/resources/" + idDelRecurso;
    request(app)
      .delete(url)
      //.delete("/api/resources/10")
      .expect(204)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("no deberia eliminar un recurso, el recurso no existe", (done) => {
    const url = "/api/resources/" + idDelRecurso;
    request(app)
      .delete(url)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
