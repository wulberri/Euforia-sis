import { createPool } from "mysql2/promise";

//Credenciales de la base de datos de mysql
export const pool = createPool({
    host: 'localhost',
    port: 3306,
    user: 'root', //Como no esta configutado un usuario por defecto es 'root'
    password: 'root', //Como no hay contraseña se pone un string vacio
    database: 'euforia' //Nombre de la base de datos
})
