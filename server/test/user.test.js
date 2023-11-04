import request from "supertest";
import app from "../server.js";

const userData = {
  nombre: "test",
  correo: "test@test.com",
  contrasena: "test",
};

// Ejemplo de prueba de registro
// describe("Registro de usuario", () => {
//   it("debería crear un nuevo usuario", (done) => {
//     request(app)
//       .post("/api/user/signup")
//       .send(userData)
//       .expect(201) // Se espera un código de respuesta 201 (creado)
//       .end((err, res) => {
//         if (err) return done(err);
//         // Verifica que la respuesta incluya un mensaje de éxito
//         expect(res.body.message).toBe("Usuario registrado exitosamente");
//         // Limpieza: Eliminar el usuario creado si es necesario
//         done();
//       });
//   });
// });

describe("getAllUsers", () => {
  it("debería medir el tiempo de una consulta a la base de datos", (done) => {
    const startTime = process.hrtime();
    request(app)
      .get("/api/user/users")
      .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjo4Mywibm9tYnJlIjoiZXVmb3JpYSIsImNvcnJlbyI6ImV1Zm9yaWFAZ21haWwuY29tIiwiaWF0IjoxNjk3NTk1MjE3LCJleHAiOjE2OTc1OTg4MTd9.yQalkfki_Cb-dtCBMjIxUoCAblVMpw3YihcpzTGMFD8')
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
